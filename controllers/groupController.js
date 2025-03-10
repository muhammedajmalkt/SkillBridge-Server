const Group = require("../Models/groupModel")
const User = require("../Models/userModel")

//create Grp
exports.createGroup= async(req,res)=>{
    const {title,details,category,image} = req.body
    const {userId}=req.user
    const user = await User.findById(userId)
    if(!user)return res.status(404).json({success:false,message:"User not found"})
    
    const newGroup = await Group({
        title,
        details,
        category,
        image,
        createdBy:userId,
        members:[userId]
    })
    await newGroup.save()
    res.status(200).json({success:true,message:"Group created SuccessFully",data:newGroup})
}

// joning
exports.groupJoin= async(req,res)=>{
    const {userId} = req.user
    const {groupId} = req.body    
    const group = await Group.findById(groupId)
    if(!group)return res.status(404).json({success:false,message:"User not found"})
    if(!group.members.includes(userId)){
     group.members.push(userId)
     await group.save()
     res.status(200).json({success:true,message:"User addedd to the group",data:group})
    }else{
        res.status(400).json({success:false,message:"User already exisit"})
    }    

}

//get group
exports.getGroup = async(req,res)=>{
    const allgroup = await Group.find().sort({createdAt:1})

    res.status(200).json({success:true,data:allgroup})
}