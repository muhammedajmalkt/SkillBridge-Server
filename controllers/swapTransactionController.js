const { default: mongoose } = require("mongoose");
const SwapTransaction = require("../Models/swapTransactionModel");
const { users } = require("../Sockets/notificationSocket");
const User = require("../Models/userModel");
const Notification = require("../Models/Notification");

exports.createSwapTransaction = async(req,res,io)=>{
    const {requesterSkillId,requesterUserId,receiverSkillId,receiverUserId} = req.body
    // console.log(req.body);
    if (!requesterSkillId || !requesterUserId || !receiverSkillId || !receiverUserId) {
        return res.status(400).json({ success: false, message: "All fields are required!" });
      }
    if(requesterUserId === receiverUserId) {
      return res.status(400).json({success:false,message:"Cannot swap skills with yourself. Please select a different user."})
    } 
    // const existingSwap = await SwapTransaction.findById(requesterSkillId)
    // if(existingSwap){
    //   return  res.status(400).json({success:false,message:"Skill already swaped"})
    // }
   const newTransaction = new SwapTransaction({
    requesterSkill:[{userId:requesterUserId,skillId:requesterSkillId}],
    receiverSkill:[{userId:receiverUserId,skillId:receiverSkillId}]
   })   
   await newTransaction.save()

   const notification = new Notification({
      sender:requesterUserId,
      receiver:receiverUserId,
      message: "You have a new skill swap request!"
   })
   await notification.save()
   res.status(200).json({success:true,message:"Your swap request has been sent successfully!",data:newTransaction})

   const rqtdUser= await User.findById(requesterUserId)
   const receiverSocketId = users.get(receiverUserId);
   if (receiverSocketId) {
      req.io.to(receiverSocketId).emit("received_message", {
        sender:{
         image:rqtdUser.image,
         name:rqtdUser.name,
      },
       message: "You have a new skill swap request!"
     });
     console.log(`Notification sent to user ${receiverUserId}`);
   } else {
     console.log(` User ${receiverUserId} is offline`);
   }

}  

//get sendrequest by userId
exports.getSendRequest = async (req,res)=>{
   const {userId}=req.user
   const getTransaction = await SwapTransaction.find({ "requesterSkill.userId": userId, assessedUsers: { $nin: [userId] } }).sort({createdAt:-1})
   .populate("receiverSkill.skillId", "offeredTitle offeredCategory offeredImage offeredExpireince ")
   // .populate("requesterSkill.skillId", "offeredTitle offeredCategory offeredImage offeredExpireince ")
   // .populate("receiverSkill.skillId","neededTitle neededCategory neededImage ")
   if(!getTransaction){
    return res.status(400).json({success:false,message:"Swap not Found "})
   }
      
   res.status(200).json({success:true,data:getTransaction})
}

//// get receivedrequset by userId
exports.getreceivedRequest = async (req,res)=>{
   const {userId}=req.user
   const getTransaction = await SwapTransaction.find({ "receiverSkill.userId": userId ,assessedUsers: { $nin: [userId] }}).sort({createdAt:-1})
   .populate("requesterSkill.skillId", "offeredTitle offeredCategory offeredImage offeredExpireince")
   .populate("receiverSkill.skillId", "offeredTitle offeredCategory offeredImage offeredExpireince")
   // .populate("receiverSkill.skillId","neededTitle neededCategory neededImage")
   if(!getTransaction){
    return res.status(400).json({success:false,message:"Swap not Found "})
   }
   res.status(200).json({success:true,data:getTransaction})
}
//unswap
exports.unswap = async (req,res)=>{
   const {transactionId} =req.params   
   const transaction = await SwapTransaction.findByIdAndDelete(transactionId)
   if(!transaction){
      return res.status(400).json({success:false,message:"Swap not Found "})
   } 
   res.status(200).json({success:true,message:"Unswaped",data:transaction})  
}

//acceptRequest
exports.acceptRequest = async (req,res)=>{
   const {transactionId}=req.body
   const transaction = await SwapTransaction.findById(transactionId);
   if(!transaction){
      return res.status(400).json({success:false,message:"Swap not Found"})
   }
   const updatetransaction = await SwapTransaction.findByIdAndUpdate(
      transactionId,
      {isPending:false},
      {new:true}
   )
   res.status(200).json({success:true,message:"Accepted",data:updatetransaction})  
}

////reject
exports.rejectRequest = async (req,res)=>{
   const {transactionId}=req.params
   const transaction = await SwapTransaction.findByIdAndDelete(transactionId)
   if(!transaction){
      return res.status(400).json({success:false,message:"Swap not Found"})
   }
   res.status(200).json({success:true,message:"Declined",data:transaction})  
}

/// iscompleted 
exports.isCompleted = async (req,res)=>{
     const { transactionId , role } = req.body
   //   console.log(req.body)
    const transaction = await SwapTransaction.findById(transactionId)        
    if(!transaction) return res.status(400).json({succes:false,message:"Swap not found"})
    const updateField = role === "requester" ? { isCompletedByRequester: true } : { isCompletedByReceiver: true };
 
    const updatedTransaction = await SwapTransaction.findByIdAndUpdate(
      transactionId,
      updateField,
      {new:true}
    )
       res.status(200).json({succes:true,messsage:"Swap Completed" ,data:updatedTransaction}) 
}

//////////
// get allNotification
exports.getNotification = async(req,res)=>{
   const {userId}= req.user
   const notification = await Notification.find({receiver:userId}).limit(10).sort({timestamp:-1})
   .populate("sender", "image name" )
   res.status(200).json({success:true,data:notification})
}