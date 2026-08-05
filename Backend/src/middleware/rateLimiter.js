const redisClient=require("../config/redis");

const tier_config= {
  admin: { maxRequests: 10000, windowInSeconds:15 },
  user: { maxRequests: 1000, windowInSeconds:40 },
  default: { maxRequests: 30, windowInSeconds:100 }
};

const rateLimiter=async (req,res,next)=>{
    try{
        const userId=req?.result?._id;
        const role=req?.result?.role;
        const key=userId?`user:${userId}`:`ip:${req.ip}`;
        const rediskey=`rate-limit:${key}`;

        const config=tier_config[role]||tier_config?.default;
        const maxLimits=config?.maxRequests;
        const windowTime=config?.windowInSeconds

        const count=await redisClient.incr(rediskey);

        if(count==1){
            await redisClient.expire(rediskey,windowTime);
        }

        if(count>maxLimits){
            return res.status(429).json({
                error:"Too many request",
                message:"Limit reached try again later"
            });
        }
        next();
    }
    catch(err){
        console.log("rate limiter error"+err);
        next();
    }
}
module.exports=rateLimiter;