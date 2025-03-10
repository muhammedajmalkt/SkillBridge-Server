const mongoose = require("mongoose")
const swapTransaction = new mongoose.Schema({
    requesterSkill :[
            {
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"User",
                    required: true,
                },
                 skillId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Swap" ,
                    required: true,
                 } 
            }
    ] ,
    receiverSkill:[
        {
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required: true,
            },
             skillId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Swap" ,
                required: true,
             } 
        }
    ],  
     isCompletedByRequester:{
        type:Boolean,
        default:false
    },
    isCompletedByReceiver:{
        type:Boolean,
        default:false
    },
    isPending:{
        type:Boolean,
        default:true
    },
   assessedUsers:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"User"
       }],



},{timestamps:true})

const SwapTransaction = mongoose.model("SwapTransaction",swapTransaction)
module.exports=SwapTransaction