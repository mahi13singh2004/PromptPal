import User from "../models/user.model.js"
import jwt from "jsonwebtoken"

const verifyToken=async(req,res,next)=>{
    try {
        const token=req.cookies.token
        if(!token){
            return res.status(401).json({message:"Unauthorized"})
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await User.findById(decoded.id)
        if(!user){
            return res.status(401).json({message:"Unauthorized"})
        }
        req.user=user
        next()
    } 
    catch (error) {
        console.log("Error in verifyToken",error.message)
        return res.status(500).json({message:"Internal Server Error"})    
    }
}

export default verifyToken