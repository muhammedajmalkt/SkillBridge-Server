const jwt = require("jsonwebtoken")

exports.generateAccesstoken= (user)=>{
    return jwt.sign({
        userId:user._id,
        email:user.email,
        role:user.role,
    },process.env.JWT_SECRET,{expiresIn:"24h"})
}
