const Chat = require("../Models/chatModel")

exports.sendMessage = async (req,res) => {
    const {senderId,receiverId,chat,messageType} =req.body
    const newChat = new Chat({
        senderId,
        receiverId,
        chat,
        messageType,
        seen: false
    })
    await newChat.save()
    // Emit real-time message to the receiver
    req.io.to(receiverId).emit("newMessage",newChat);

    res.status(201).json(newChat);
}

//history of two users 
exports.getChats = async (req,res)=>{
    const senderId = req.user.userId
    const {receiverId} = req.params
     const messages  = await Chat.find({
        $or:
        [{senderId:senderId,receiverId:receiverId},
         {senderId:receiverId,receiverId:senderId} ]
    }).sort({createdAt:1})
    
    res.status(200).json({success:true,data:messages})
}