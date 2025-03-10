const express = require("express")
const router = express.Router()
const verifyToken  = require("../Middlewares/verifyToken")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const { createGroup, groupJoin, getGroup } = require("../controllers/groupController")


router.post("/creategroup",verifyToken,asyncErrorhandler(createGroup))
router.put("/groupjoin",verifyToken,asyncErrorhandler(groupJoin))
router.get("/showgroup",asyncErrorhandler(getGroup))

module.exports = router