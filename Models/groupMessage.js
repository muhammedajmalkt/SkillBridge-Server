const mongoose = require("mongoose")
const MessageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  chat: { type: String},
  media: { type: String }, // URL to images, videos, etc.
//   seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have seen the message
}, { timestamps: true });

const Message = mongoose.model("Message", MessageSchema);
module.exports = Message