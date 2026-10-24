const User=require("../models/user");
const jwt=require("jsonwebtoken");
const validate=require("../utils/validator");
const bcrypt=require("bcrypt");
const userMiddleware=require("../middleware/userMiddleware");
const redisClient=require("../config/redis")
const Submission=require("../models/submission");
const Problem=require("../models/problems");

const register=async (req,res)=>{
    try{

        //first validate the data

        validate(req.body);
        const {firstName,emailId,password}=req.body;
    
        const hashedPassword=await bcrypt.hash(password,10);

        const user=await User.create({
            firstName:firstName.trim(),
            emailId:emailId,
            password:hashedPassword,
            role:'user'
        });

        const token=jwt.sign({_id:user._id,emailId:user.emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{
            httpOnly: true,
            maxAge:60*60*1000,
            sameSite: "none",
            secure: true
        });
        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }
        res.status(201).json({
            user:reply,
            message:"Registered Sucessfully"
        });
    }



    catch (err) {
        // Handle duplicate email (MongoDB E11000 unique constraint violation)
        if(err.code===11000){
            return res.status(400).json({
                message:"An account with this email already exists"
            });
        }
        res.status(400).json({
        message: err.message || "Registration failed"
    });
}
}

const login=async(req,res)=>{

    try{
        const {emailId,password}=req.body;
        console.log(`[LOGIN] Attempt for email: ${emailId}`);

        if(!emailId)
            throw new Error("Invalid Credentials");
        if(!password)
            throw new Error("Invalid Credentials");

        // Normalize email to match what Mongoose stores (schema has lowercase:true)
        const normalizedEmail=emailId.trim().toLowerCase();
        const user=await User.findOne({emailId:normalizedEmail});

        if (!user) {
            console.log(`[LOGIN] No user found with email: ${emailId}`);
            throw new Error("Invalid Credentials");
        }

        console.log(`[LOGIN] User found: ${user._id}, comparing password...`);
        const match=await bcrypt.compare(password,user.password);

        if(!match){
            console.log(`[LOGIN] Password mismatch for user: ${user._id}`);
            throw new Error("Invalid Credentials");
        }

        const token=jwt.sign({_id:user._id,emailId:emailId,role:user.role},process.env.JWT_KEY,{expiresIn:60*60});

        res.cookie('token',token,{
            httpOnly: true,
            maxAge:60*60*1000,
            sameSite: "none",
            secure: true
        });

        const reply={
            firstName:user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role
        }

        console.log(`[LOGIN] Success for user: ${user._id}, token set`);
        res.status(200).json({
            user:reply,
            message:"Logged In Sucessfully"
        });



    }

    catch(err){
        console.log(`[LOGIN] Failed: ${err.message}`);
        res.status(401).json({ message: err.message || "Login failed" });
    }
}


const logout=async(req,res)=>{

    try{
        const {token}=req.cookies;

        if(token){
            const payload=jwt.decode(token);
            if(payload && payload.exp){
                await redisClient.set(`token:${token}`,"Blocked");
                await redisClient.expireAt(`token:${token}`,payload.exp);
            }
        }

        // Must include sameSite + secure to clear cross-origin cookies
        res.cookie("token","",{
            httpOnly:true,
            sameSite:"none",
            secure:true,
            expires:new Date(0)
        });
        res.status(200).json({message:"Logged Out Successfully"});

    }
    catch(err){
        res.status(503).json({message:"Logout failed: "+err.message}); 
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

        res.cookie('token',token,{httpOnly: true,maxAge:60*60*1000});
        res.status(201).send("Admin created Sucessfully");
    }
    catch(err){
        res.status(400).send("Error:"+err);
    }
}
const deleteProfile=async(req,res)=>{
    try{
        const id=req.result._id;
        await Submission.deleteMany({userId:id});
        await User.findByIdAndDelete(id);
        res.status(200).send("Deleted Sucessfully");
    }
    catch(err){
        res.status(500).send("Server Error: "+err.message);
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
const getProfile = async (req, res) => {
    try {
        const userId = req.result._id;
        const since = new Date();
        since.setDate(since.getDate() - 365);

        const [user, total, accepted, recent, activity] = await Promise.all([
            User.findById(userId)
                .select("-password")
                .populate({ path: "problemSolved", select: "_id title difficulty tags" })
                .lean(),
            Submission.countDocuments({ userId }),
            Submission.countDocuments({ userId, status: "accepted" }),
            Submission.find({ userId })
                .sort({ createdAt: -1 })
                .limit(10)
                .select("problemId language status runtime memory testCasesPassed totalTestCases createdAt")
                .lean(),
            Submission.aggregate([
                { $match: { userId, createdAt: { $gte: since } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
        ]);

        if (!user) return res.status(404).json({ message: "User not found" });

        const stats = user.stats || { solved: 0, easy: 0, medium: 0, hard: 0 };

        res.status(200).json({
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                emailId: user.emailId,
                role: user.role,
                createdAt: user.createdAt,
            },
            problemsSolved: {
                total: stats.solved,
                easy: stats.easy,
                medium: stats.medium,
                hard: stats.hard,
                problems: user.problemSolved,
            },
            submissions: {
                total,
                accepted,
                acceptanceRate: total > 0 ? Math.round((accepted / total) * 100) : 0,
                recent,
            },
            // new: [{ _id: "2026-10-24", count: 3 }, ...] for a heatmap later
            activity: activity.map((a) => ({ date: a._id, count: a.count })),
        });
    } catch (err) {
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};
module.exports={register , login, logout, adminRegister,deleteProfile,checkUser,getProfile };