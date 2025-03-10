const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
    title:{type:String,required:true},
    details:{type:String,required:true},
    image:{type:String},
    category: {type:String,required:true,
    enum:[ "art/creativity",
        "cooking",
        "computer/it",
        "outdoor/sports",
        "languages",
        "consulting",
        "beauty/health",
        "education",
        "music",
        "others"],
        default:""
    },
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    members:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}]

},{timestamps:true})

const Group = mongoose.model("Group",groupSchema)
module.exports = Group