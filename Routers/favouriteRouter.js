const express = require("express")
const verifyToken = require("../Middlewares/verifyToken")
const asyncErrorhandler = require("../Middlewares/asyncErrorHandler")
const { addToFavourite, getFavourite, removeFromFavourite } = require("../controllers/favouriteController")
const router = express.Router()


router.post("/addtofavourite",verifyToken,asyncErrorhandler(addToFavourite))
router.get("/showfavourite",verifyToken,asyncErrorhandler(getFavourite))
router.put("/removefromfavourite",verifyToken,asyncErrorhandler(removeFromFavourite))

module.exports= router