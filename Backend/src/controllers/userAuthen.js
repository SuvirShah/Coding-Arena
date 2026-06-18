const User=require("../models/user");
const jwt=require("jsonwebtoken");
const validate=require("../utils/validator");
const bcrypt=require("bcrypt");
const userMiddleware=require("../middleware/userMiddleware");
const redisClient=require("../config/redis")
const Submission=require("../models/submission");

const register=async (req,res)=>{
    try{

        //first validate the data

        validate(req.body);
        const {firstName,emailId,password}=req.body;
    
        req.body.password=await bcrypt.hash(password,10);
        req.body.role='user';

        const user=await User.create(req.body);

        const token=jwt.sign({_id:user._id,emailId:emailId,role:'user'},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000});
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id
        }
        res.status(201).json({
            user:reply,
            message:"Registered Sucessfully"
        });
    }



    catch (err) {
        res.status(400).json({
        message: err.message || "Registration failed"
    });
}
}

const login=async(req,res)=>{

    try{
        const {emailId,password}=req.body;
        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");


        const user=await User.findOne({emailId});

        if (!user) {
            throw new Error("Invalid Credentials");
        }

        const match=await bcrypt.compare(password,user.password);

        if(!match)
            throw new Error("Invalid Credentials");

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000});

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }

        res.status(200).json({
            user:reply,
            message:"Logged In Sucessfully"
        });



    }

    catch(err){
        res.status(401).send("Error:"+err);
    }
}


const logout=async(req,res)=>{

    try{
        const {token}=req.cookies;

        const payload=jwt.decode(token);

        await redisClient.set(`token:${token}`,"Blocked");
        await redisClient.expireAt(`token:${token}`,payload.exp);


        res.cookie("token",null,{expires:new Date(Date.now())});
        res.send("Logged Out Sucessfully");

    }
    catch(err){
        res.status(503).send("Error:"+err); 
    }
}

const adminRegister=async(req,res)=>{
        try{
        
        validate(req.body);
        

        const {firstName,emailId,password}=req.body;
    
        req.body.password=await bcrypt.hash(password,10);
        // req.body.role='admin';

        const user=await User.create(req.body);

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{maxAge:60*60*1000});
        res.status(201).send("Admin created Sucessfully");
    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}
const deleteProfile=async(req,res)=>{
    try{
        const id=req.result._id;
        await User.findByIdAndDelete(id);
        Submission.deleteMany({id});
        res.status(200).send("Deleted Sucessfully");
    }
    catch(err){
        res.status(404).send("Server Error"+err);
    }
};
const checkUser=(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid User"
    })

}
module.exports={register , login, logout, adminRegister,deleteProfile,checkUser };