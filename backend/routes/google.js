const express = require("express")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const { generateAccessToken, generateRefreshToken } = require("../utils/generateToken")

const router = express.Router()
router.get("/api/auth/google", passport.authenticate("google", { scope: ["profile", "email"], failureRedirect: "/login/failure" }))

router.get(
    "/api/auth/google/callback",
    (req, res, next) => {
        next()
    },
    passport.authenticate("google", {
        failureRedirect: "/login/failure",
        session: false,
    }),
    (req, res) => {
        // Tạo token như bình thường
        // const token = generateAccessToken(req.user._id, req.user.role)
        const accessToken = generateAccessToken(req.user._id, req.user.role)
        const refreshToken = generateRefreshToken(req.user._id)

        res.redirect(`${process.env.CLIENT_URL}?accessToken=${accessToken}&refreshToken=${refreshToken}`)
    }
)

// Thêm route xử lý khi login thất bại
router.use("/login/failure", (req, res) => {
    res.status(401).json({
        message: "Google Authentication Failed",
        error: "Unable to authenticate with Google",
    })
})

module.exports = router
