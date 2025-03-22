const Swap = require("../Models/skillModel")
const SwapTransaction = require("../Models/swapTransactionModel")
const { swapSchema } = require("../Validation/swapValidation")

exports.createSwap = async(req,res)=>{
    const {userId} = req.user
   let { offeredTitle, offeredCategory,offeredExpireince,offeredDetails,
    neededTitle,neededCategory,neededPriority, neededDetails,hours,questions} = req.body
    const files = req.files;     
    // extract URLs from cloudinary uploads    
    const offeredImage = files["offeredImage"]?.[0]?.path;
    const neededImage = files["neededImage"]?.[0]?.path;      
    const {error,value} = swapSchema.validate({offeredTitle, offeredCategory,offeredExpireince,offeredDetails,
        neededTitle,neededCategory,neededPriority, neededDetails,hours})

        if (typeof questions === "string") {
            questions = JSON.parse(questions);
        }
      if(error){
        console.log(error);
       return res.status(400).json({success:false,message:error.details[0].message})
      } 
     const newSwap = new Swap({
         ...value,
         offeredImage:offeredImage,
         neededImage:neededImage,
        userId:userId,
        questions        
     })
     await newSwap.save()
     res.status(200).json({success:true,message:"New swap created",data:newSwap})  
}

// exports.getSwap = async (req,res)=>{    
//     const {page = 1,limit = 12, offeredTitle = "",offeredCategory = ""} = req.query
//     const skip = (page - 1 ) * limit
//     let filter = {}
     
//     filter = {isDeleted :false }
//     // isCompleted:false
//     if(offeredTitle){
//         filter.offeredTitle ={ $regex: offeredTitle, $options: "i" };
//     }
//     if(offeredCategory){
//         filter.offeredCategory=offeredCategory
//     }
//     const swaps= await Swap.find(filter).skip(skip).limit(limit).sort({createdAt:-1})
//     const totalSwaps= await Swap.countDocuments(filter)
//     res.status(200).
//     json({
//         success:true,
//         data:swaps,
//         pagination:{
//             total:totalSwaps,
//             page:Number(page),
//             limit:Number(limit),
//             totalPages:Math.ceil(totalSwaps/limit)}
//     })
// }

exports.getSwap = async (req, res) => {
    const { page = 1, limit = 12, offeredTitle = "", offeredCategory = "" } = req.query;
    const skip = (page - 1) * limit;
    let filter = { isDeleted: false ,assessedUser :null};
    if (offeredTitle) {
        filter.offeredTitle = { $regex: offeredTitle, $options: "i" };
    }
    if (offeredCategory) {
        filter.offeredCategory = offeredCategory;
    }
    const swaps = await Swap.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
    const totalFilteredSwaps = await Swap.countDocuments(filter);

    res.status(200).json({
        success: true,
        data: swaps,
        pagination: {
            total: totalFilteredSwaps,
            page: Number(page),
            limit: Number(limit),
            totalPages: Math.ceil(totalFilteredSwaps / limit),
        }
    });
};


////details
exports.swapById =async(req,res) =>{    
    const {skillid} = req.params
    const skill = await Swap.findById(skillid).populate("userId", "-password")
    if(!skill){
        res.status(404).json({success:false,message:"Skill not found"})
    }
    res.status(200).json({success:true,data:skill})

}

// get all swapSkill by UserID
exports.getSwapByUserId = async(req,res)=>{
    const userId =req.user.userId    
    const swapSkills = await Swap.find({userId,isDeleted:false,assessedUser:null}).sort({updatedAt:-1})
    if(!swapSkills){
        return res.status(404).json({success:false,message:"Skill Swap not found !"})
    }
    res.status(200).json({success:true,message: "Successfully founded", data:swapSkills})
}
// get all swapSkill by UserID for profile
exports.getSkillForProfile = async(req,res)=>{
    const userId =req.user.userId    
    const swapSkills = await Swap.find({userId,isDeleted:false}).sort({updatedAt:-1})
    if(!swapSkills){
        return res.status(404).json({success:false,message:"Skill Swap not found !"})
    }
    res.status(200).json({success:true,message: "Successfully founded", data:swapSkills})
}

//delete swapSkill
exports.deleteSwapSkill = async (req,res)=>{    
    const {skillId} = req.body
    const deleteSkill = await Swap.findOneAndUpdate(
     {_id:skillId},
     {isDeleted:true,deletedDate:Date.now()},
     {new:true}
    )
    if(!deleteSkill){
        return res.status(400).json({success:false,message:"Skill not found"})
    }
    res.status(200).json({success:false,message:"Successfully deleted" ,deleteSkill:deleteSkill})
}

///get questionnaire
exports.getQuestionnair = async (req,res) =>{
    const {skillid, transactionId} = req.query
    const existSkill = await Swap.findById(skillid)
    if(!existSkill){
        return res.status(400).json({success:false,message:"Skill not found"})
    }
    const isCompleted = await SwapTransaction.findById(transactionId)
    if (!isCompleted) {
        return res.status(400).json({ success: false, message: "Swap transaction not found" });
    }
    if(isCompleted.isCompletedByRequester === false || isCompleted.isCompletedByReceiver === false){
       return res.status(400).json({succes:false,message:"Swap not completed"}) 
    }
    return res.status(200).json({success:true,data:existSkill.questions})
}
//post score
exports.postScore = async(req,res)=>{
    const {userId} =req.user
    const {assessedUser,score,skillId,transactionId} = req.body    
    const addScore = await Swap.findByIdAndUpdate(
        skillId,
        {assessedUser:assessedUser,score:score},
        {new:true}
    )
    if(!addScore){
        return res.status(400).json({succes:false,message:"Skill not found"})
    }
    const transaction = await SwapTransaction.findById(transactionId)
    const isAssesed = transaction.assessedUsers.includes(userId)
    if(!isAssesed){
        transaction.assessedUsers.push(userId)
    }

    await transaction.save()
    res.status(200).json({succes:true,message:"Assessment submitted!",data:addScore})
}

//get score in to profile 
exports.scoreIntoProfile = async (req,res)=>{
    const {userId} =req.user
    const assessed = await Swap.find({assessedUser:userId}).sort({createdAt:-1})
        if(!assessed){
           return res.status(400).json({success:false,message:"Assessed not completed"})
        }

        res.status(200).json({succes:true,data:assessed})   

}