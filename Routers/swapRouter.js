const  express = require("express")
const verifyToken = require("../Middlewares/verifyToken")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const { createSwap, getSwap, swapById, getSwapByUserId, deleteSwapSkill, getQuestionnair, postScore, scoreIntoProfile, getSkillForProfile } = require("../controllers/swapControlelr")
const upload = require("../Middlewares/uploadeMiddleware")
const router = express.Router()

router.post("/createswap",verifyToken,upload.fields([{name:"offeredImage",maxCount:1},{name:"neededImage",maxCount:1}]),asyncErrorhandler(createSwap))
router.get("/getswap",asyncErrorhandler(getSwap))
router.get("/getswap/:skillid",asyncErrorhandler(swapById))
router.get("/get/getSwapByUserId",verifyToken,asyncErrorhandler(getSwapByUserId))
router.get("/get/getskillforprofile",verifyToken,asyncErrorhandler(getSkillForProfile))
router.patch("/get/deleteswap",verifyToken,asyncErrorhandler(deleteSwapSkill))
router.get('/get/questionnair',verifyToken,asyncErrorhandler(getQuestionnair))
router.put('/postscore',verifyToken,asyncErrorhandler(postScore))
router.get('/getscore',verifyToken,asyncErrorhandler(scoreIntoProfile))

module.exports = router