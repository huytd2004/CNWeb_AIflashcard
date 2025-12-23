const jwt = require("jsonwebtoken")

// Tạo Access Token (hết hạn sau 7day)
const generateAccessToken = (userId, role = "user") => {
    return jwt.sign(
        {
            id: userId,
            userId: userId, // Để tương thích với middleware
            role: role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "7d", // Thay đổi từ 30s thành 7d cho phù hợp
        }
    )
}

// Tạo Refresh Token (hết hạn sau 7 ngày)
const generateRefreshToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    })
}

module.exports = { generateAccessToken, generateRefreshToken }
