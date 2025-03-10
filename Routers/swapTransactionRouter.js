const express = require("express")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const router = express.Router()
const {createSwapTransaction,  getreceivedRequest, getSendRequest, unswap, acceptRequest, rejectRequest, getNotification, isCompleted} = require("../controllers/swapTransactionController")
const verifyToken = require("../Middlewares/verifyToken")

router.post("/createtransaction",verifyToken,asyncErrorhandler(createSwapTransaction))
router.get("/getrequested",verifyToken,asyncErrorhandler(getSendRequest))
router.get("/getreceived",verifyToken,asyncErrorhandler(getreceivedRequest))
router.delete ("/unswap/:transactionId",verifyToken,asyncErrorhandler(unswap))
router.put("/acceptrequest",verifyToken,asyncErrorhandler(acceptRequest))
router.delete("/rejectrequest/:transactionId",verifyToken,asyncErrorhandler(rejectRequest))
router.put("/iscompleted",verifyToken,asyncErrorhandler(isCompleted))

router.get("/getNotification",verifyToken,asyncErrorhandler(getNotification))



module.exports = router