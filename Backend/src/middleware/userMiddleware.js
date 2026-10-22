const jwt=require("jsonwebtoken");
const User=require("../models/user");
const redisClient=require("../config/redis");

const userMiddleware=async(req,res,next)=>{

    try{
        // Support both cookie and Authorization header
        let token=req.cookies?.token;
        if(!token && req.headers.authorization?.startsWith("Bearer ")){
            token=req.headers.authorization.split(" ")[1];
        }

        if(!token)
            return res.status(401).json({message:"Authentication required"});

        const payload=jwt.verify(token,process.env.JWT_KEY);

        const {_id}=payload;

        if(!_id)
            return res.status(401).json({message:"Invalid Token"});

        const result=await User.findById(_id).select("-password");

        if(!result)
            return res.status(401).json({message:"User does not exist"});
        

        const isBlocked= await redisClient.exists(`token:${token}`);

        if(isBlocked)
            return res.status(401).json({message:"Token has been revoked"});

        req.result=result;

        next();

    }
    catch(err){
        res.status(401).json({message:err.message||"Unauthorized"});
    }

}

module.exports=userMiddleware;