const User = require("../Models/userModel")
const { doHash, doHashValidation } = require("../Utils/Hashing")
const { generateAccesstoken } = require("../Utils/token")
const {signupSchema, loginSchema}= require("../Validation/authValidation")

exports.signup = async(req,res)=>{
        const {name,email,password} =req.body
        // console.log(req.body);
        const {error, value} =  signupSchema.validate({name,email,password})
        if(error){
            res.status(401).json({success:false,message:error.details[0].message})
        }
        const existingUser= await User.findOne({email})
        if(existingUser){
           return res.status(400).json({success:false,message:"User already Exists"})
        }
        const hashPassword=await doHash(password,12)
        const newUser = new User({
            name,
            email,
            password:hashPassword
        })
        await newUser.save()
          newUser.password = undefined
        res.status(200).json({success:true,message:"Your account hasbeen created successfully",data:newUser})
    
      
}

exports.login = async (req,res)=>{
    
        const {email,password}=req.body
        const {error } =loginSchema.validate({email,password}) 
        if(error){
            return res.status(400).json({success:false,message:error.details[0].message})
        }
        const existingUser = await User.findOne({email})
        if(!existingUser){
          return res.status(400).json({success:false,message:"User not found"})
        }
        const credential = await doHashValidation(password,existingUser.password)
        if(!credential){
            return res.status(400).json({success:false ,message: "Invalid credential!"})
        }
        if(existingUser.isBlocked === true) {
            return res.status(400).json({success:false ,message:  "Your account has been blocked by admin"})
        }
        const accessToken = generateAccesstoken(existingUser)
                // set cookie with token
                res.cookie("accessToken", accessToken, {
                    httpOnly: true,  
                    secure:false,
                    // sameSite: "strict", 
                    maxAge: 24 * 60 * 60 * 1000 
                });

        existingUser.password = undefined
        res.status(200).json({success:true,message:"Successfully loged",data:existingUser})

}

//cr login
exports.logedUser= async (req,res)=>{
        const userId = req.user.userId
        const user = await User.findById(userId).select("-password")
        if(!user){
            res.status(404).json({success:false ,message:"User not found"})
        }
        res.status(200).json({success:true,message:"User data fetched successfully",data:user})
}
        

exports.logOut = async (req,res) =>{
        res.clearCookie("accessToken")
        res.status(200).json({success:true,message:"Logged out successfully"})      
}


exports.editProfie = async (req,res)=>{
    const {userId} = req.user 
    let {name,bio,link } = req.body;
        const image =req.file?.path
        // console.log(image);
        
    const updateProfile = await User.findByIdAndUpdate(
        userId,
        {$set :{bio: bio,link:link,image:image,name:name}},
        {new:true}
    )
    if(!updateProfile){
        res.status(404).json({success:false,message : "User Not found"})
    }
    updateProfile.password = undefined
    res.status(200).json({success:true,message:"Successfully updated your profile",data:updateProfile})
}

//find user and get details
exports.findUser = async(req,res)=>{
    const {receiverId} = req.params    
    const user = await User.findById(receiverId)
    if(!user){
        return res.status(400).json({success:false,message:"User not found"})
    }
    res.status(200).json({success:true,data:user})
}