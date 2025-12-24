const jwt = require("jsonwebtoken")
const validator = require("validator")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const { sendForgetPasswordMail } = require("../services/nodemailer")
const { GamificationProfile } = require("../models/GamificationProfile")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")

const getProfile = async (req, res) => {
    try {
        const { id } = req.user
        const user = await User.findById(id).select("-password")
        return res.status(200).json({ user })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const registerUser = async (req, res) => {
    try {
        const { displayName, email, password } = req.body
        if (!displayName || !email || !password) {
            return res.status(400).json({ message: "Vui lòng điền đẩy đủ thông tin!" })
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Email không hợp lệ" })
        }
        let isEmail = await User.findOne({ email })
        if (isEmail) return res.status(400).json({ message: "Email đã được sử dụng" })

        if (password.length < 6) {
            return res.status(400).json({ message: "Mật khẩu phải trên 6 kí tự" })
        }
        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = new User({
            displayName,
            email,
            password: hashedPassword,
        })
        // Tạo GamificationProfile cho user mới
        const gamificationProfile = new GamificationProfile({
            user_id: newUser._id,
        })
        await gamificationProfile.save()
        newUser.gamification = gamificationProfile._id
        const savedUser = await newUser.save()
        // Tạo tokens
        const accessToken = generateAccessToken(savedUser._id, savedUser.role)
        const refreshToken = generateRefreshToken(savedUser._id)
        // Loại bỏ password khỏi response
        const userResponse = savedUser.toObject()
        delete userResponse.password
        return res.status(201).json({
            user: userResponse,
            message: "Đăng ký thành công",
            accessToken,
            refreshToken,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email && !password) {
            return res.status(400).json({ message: "Vui lòng điền đẩy đủ" })
        }

        let user = await User.findOne({ email }).populate("gamification")
        if (!user) {
            return res.status(404).json({ message: "Người dùng không tồn tại" })
        }

        if (!user.status) {
            return res.status(403).json({ message: "Tài khoản đã bị khoá, vui lòng liên hệ cho admin qua zalo: 0364080527" })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch || !user) {
            return res.status(400).json({ message: "Tài khoản hoặc mật khẩu không đúng" })
        }

        // kiểm tra xem có GamificationProfile không, nếu không thì tạo mới
        const gamificationProfile = await GamificationProfile.findOne({ user_id: user._id })

        if (!user.gamification) {
            if (!gamificationProfile) {
                const newGamificationProfile = new GamificationProfile({
                    user_id: user._id,
                })
                await newGamificationProfile.save()
            } else {
                user.gamification = gamificationProfile._id
                await user.save()
            }
        }

        // Tạo tokens
        const accessToken = generateAccessToken(user._id, user.role)
        const refreshToken = generateRefreshToken(user._id)

        // Loại bỏ password khỏi response
        const userResponse = user.toObject()
        delete userResponse.password

        return res.status(200).json({
            user: userResponse,
            accessToken,
            refreshToken,
            message: "Đăng nhập thành công",
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const logoutUser = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    })
    res.status(200).json({ ok: true, message: "Đăng xuất thành công" })
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ message: "Vui lòng điền đẩy đủ" })
        }

        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Email không tồn tại" })
        }

        if (!user.status) {
            return res.status(400).json({ message: "Tài khoản đã bị khoá, vui lòng liên hệ cho admin qua zalo: 0364080527" })
        }

        const new_password = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(new_password, 10)
        user.password = hashedPassword
        user.isChangePassword = true
        await user.save()
        await sendForgetPasswordMail(user, new_password)

        res.status(200).json({ message: "Gửi thành công, vui lòng kiểm tra email của bạn" })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Server gặp lỗi, vui lòng thử lại sau ít phút" })
    }
}

const updatePassword = async (req, res) => {
    const { old_password, new_password, re_new_password } = req.body
    const { id } = req.user
    if (!old_password || !new_password || !re_new_password) {
        return res.status(400).json({ message: "Vui lòng điền đẩy đủ" })
    }

    if (new_password !== re_new_password) {
        return res.status(400).json({ message: "Mật khẩu mới không trùng khớp" })
    }

    if (new_password.length < 6) {
        return res.status(400).json({ message: "Mật khẩu phải trên 6 kí tự" })
    }

    let user = await User.findById(id)
    if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại" })
    }

    if (!user.status) {
        return res.status(400).json({ message: "Tài khoản đã bị khoá, vui lòng liên hệ cho admin qua zalo: 0364080527" })
    }

    const isMatch = await bcrypt.compare(old_password, user.password)

    //kiểm tra xem mật khẩu mới có trùng với mật khẩu hiện tại hay không
    const isMatchNew = await bcrypt.compare(new_password, user.password)
    if (isMatchNew) {
        return res.status(400).json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ" })
    }

    if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu cũ không đúng" })
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)

    user.password = hashedPassword
    user.isChangePassword = false // đã thay đổi mật khẩu và trường này sẽ được sử dụng để kiểm tra khi người dùng đăng nhập lần đầu tiên sau khi thay đổi mật khẩu
    await user.save()
    return res.status(200).json({ ok: true, message: "Cập nhật mật khẩu thành công" })
}

// thay đổi mật khẩu khi click vào email quên mật khẩu
const changePassword = async (req, res) => {
    const { new_password, re_new_password } = req.body
    const { id } = req.user
    if (!new_password || !re_new_password) {
        return res.status(400).json({ message: "Vui lòng điền đẩy đủ" })
    }

    let user = await User.findById(id)
    if (!user) {
        return res.status(400).json({ message: "Người dùng không tồn tại" })
    }

    if (!user.status) {
        return res.status(400).json({ message: "Tài khoản đã bị khoá, vui lòng liên hệ cho admin qua zalo: 0364080527" })
    }

    //kiểm tra xem mật khẩu mới có trùng với mật khẩu hiện tại hay không
    const isMatchNew = await bcrypt.compare(new_password, user.password)
    if (isMatchNew) {
        return res.status(400).json({ message: "Mật khẩu mới không được trùng với mật khẩu cũ" })
    }

    const hashedPassword = await bcrypt.hash(new_password, 10)

    user.password = hashedPassword
    user.isChangePassword = false // đã thay đổi mật khẩu và trường này sẽ được sử dụng để kiểm tra khi người dùng đăng nhập lần đầu tiên sau khi thay đổi mật khẩu
    await user.save()
    return res.status(200).json({ ok: true, message: "Cập nhật mật khẩu thành công" })
}

module.exports = {
    getProfile,
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    updatePassword,
    changePassword,
}
