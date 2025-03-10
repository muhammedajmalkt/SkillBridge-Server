const mongoose = require ("mongoose")

const chatSchema = new mongoose.Schema({
    senderId :{ type:mongoose.Schema.Types.ObjectId,ref: "User"},
    receiverId : { type:mongoose.Schema.Types.ObjectId,ref: "User"},
    chat : {type:String,required:true},
    messageType: { type: String, enum: ["text", "image", "video", "audio"], default: "text" },
    // mediaUrl: { type: String, default: null }, // For images/videos/audio messages
    // seen: { type: Boolean, default: false }
},{timestamps:true})

const Chat = mongoose.model("Chat",chatSchema)
module.exports = Chat