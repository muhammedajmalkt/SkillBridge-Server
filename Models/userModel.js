const mongoose= require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        min:3,  
        required:true,
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
    },
    password:{
        type:String,
        minLength:6,
        required:true
    },
    role:{
        type:String,
        enum:["user","admin"],
    },
    image:{
        type:String,
        default:"https://res.cloudinary.com/daf4u0gre/image/upload/v1741253707/skillBridge/u43qqje8bseo0pos08wy.jpg"
    },
    bio:{
        type:String,
         maxlength:60,
    },
    link:{
        type:String,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    
    
    

},{timestamps:true} 
)
 
const User = mongoose.model("User",userSchema)
module.exports = User