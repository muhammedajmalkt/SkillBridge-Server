const express = require("express")
const router = express.Router()
const verifyToken  = require("../Middlewares/verifyToken")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const { createGroup, groupJoin, getGroup, viewAllMembers, grpExit } = require("../controllers/groupController")
const upload = require("../Middlewares/uploadeMiddleware")


router.post("/creategroup",verifyToken,upload.single("image"),asyncErrorhandler(createGroup))
router.put("/groupjoin",verifyToken,asyncErrorhandler(groupJoin))
router.get("/showgroup",asyncErrorhandler(getGroup))
router.get ("/showmembers/:groupId",verifyToken,asyncErrorhandler(viewAllMembers))
router.put("/existgroup",verifyToken,asyncErrorhandler(grpExit))

module.exports = router