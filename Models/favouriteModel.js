const mongoose = require("mongoose")

const favouriteSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    favouriteSkills:[{type:mongoose.Schema.Types.ObjectId,ref:"Swap"}]

},{timestamps:true})
const Favourite = mongoose.model("Favourite",favouriteSchema)
module.exports = Favourite
