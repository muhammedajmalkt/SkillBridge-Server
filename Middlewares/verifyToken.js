const jwt = require("jsonwebtoken")

const verifyToken = (req,res,next )=>{
    const {accessToken} = req.cookies
    if(!accessToken){
        return res.status(401).json({success:false,message:"Token required"})
    }

    jwt.verify(accessToken , process.env.JWT_SECRET,(error,decoded)=>{
        if(error){
            return res.status(403).json({success:false,message:"Invalid token or expired"})
        }
        req.user = decoded 
        // console.log(decoded);
        next()

    })
}
module.exports = verifyToken