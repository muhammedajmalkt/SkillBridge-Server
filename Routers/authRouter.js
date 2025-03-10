const express = require("express")
const router = express.Router()
const {signup, login ,logedUser, editProfie, logOut, findUser} = require("../controllers/authController")
const verifyToken  = require("../Middlewares/verifyToken")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const upload = require("../Middlewares/uploadeMiddleware")

router.post("/signup",asyncErrorhandler(signup))
router.post ("/login",asyncErrorhandler(login))
router.get("/userin",verifyToken,logedUser)
router.post("/logout",asyncErrorhandler(logOut))
router.patch("/editprofile",verifyToken,upload.single("image"),asyncErrorhandler(editProfie))
router.get("/finduser/:receiverId",verifyToken,asyncErrorhandler(findUser))

module.exports=router
