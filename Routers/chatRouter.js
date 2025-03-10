const express = require ("express")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const { sendMessage, getChats } = require("../controllers/chatController")
const verifyToken = require("../Middlewares/verifyToken")
const router = express.Router()

router.post("/send",verifyToken,asyncErrorhandler(sendMessage))
router.get("/getchat/:receiverId",verifyToken,asyncErrorhandler(getChats))

module.exports = router