const express = require("express")
const { authMiddleware, checkAdminMiddleware } = require("../middleware/authorizationMiddleWare")
const { getMessages, addMessage, addReaction, unsendMessage, editMessage, createRoomName } = require("../controllers/ChatCommunityController")

const router = express.Router()
router.get("/", getMessages)
router.post("/create-room", authMiddleware, checkAdminMiddleware, createRoomName)
router.post("/", authMiddleware, addMessage)
router.post("/react", authMiddleware, addReaction)
router.post("/unsend", authMiddleware, unsendMessage)
router.put("/editmess", authMiddleware, editMessage)
module.exports = router
