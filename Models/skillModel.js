const mongoose = require("mongoose")

const swapSchema = new mongoose.Schema({
    
    userId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"User",
          required:true
    },
    offeredTitle:{
        type:String,
        minlength:[20,"Detailes at least 20 caracters"],
        required:true,
    },
    offeredCategory:{
        type:String,
        required:true,
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
    offeredExpireince:{
        type:String,
        enum:["Beginner", "Intermediate", "Expert"],
        default:"Beginner",
        required:true
    },
    offeredDetails:{
        type:String,
         minlength:[20,"Detailes at least 20 caracters"],
         maxLength:500,
         required:true


    },
    offeredImage:{
        type:String,    
    },
////////neeeded

    neededTitle:{
        type:String,
        minlength:[20,"Detailes at least 20 caracters"],
        required:true,
    },
    neededCategory:{
        type:String,
        required:true,
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
    neededPriority:{
        type:String,
        enum:["Low", "Medium", "High"],
        default:"Low",
        required:true

    },
    neededDetails:{
        type:String,
         minlength:[20,"Detailes at least 20 caracters"],
         maxLength:500,
         required:true


    },
    neededImage:{
        type:String,  

    },
    hours:{
        type:Number,
        min:1,
        required:true

    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    questions: [
        {
            currentQuestion: { type: String,},
            answers: [{ type: String }],
            correct_answer: { type: String },
            points: { type: Number, min: 1 },
            difficulty: { type: String, enum: ["Easy", "Inter", "Expert"] }
        }
    ],
    assessedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        default:null
    },
    score:{
        type:Number,
    }
 

},{timestamps:true}
)

const Swap = mongoose.model("Swap",swapSchema)
module.exports=Swap