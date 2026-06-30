const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
  quiet: true
});
const express = require("express");
const main=require("./config/db")
const app = express();
const PORT = Number(process.env.PORT) ;
const cookieParser=require("cookie-parser");
const authRouter=require("../src/routes/userAuth");
const redisClient=require("../src/config/redis");
const ProblemRouter=require("../src/routes/problemSetter");
const submitRouter = require("./routes/submit");
const aiRouter=require('../src/routes/aiChatting');
const videoRouter=require("../src/routes/videoCreator");
const cors=require('cors');


const allowedOrigins = [
    "http://localhost:5173",
    "https://coding-arena-q2hl.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/user",authRouter);
app.use("/problem",ProblemRouter);
app.use("/submission",submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);


const IntializeConnection=async()=>{

    try{
        await Promise.all([main(),redisClient.connect()])
        console.log("DB Connected");

        app.listen(PORT,()=>{
        console.log(`Server Listening at ${PORT}`);
        })
    }
    catch(err){
        console.log("Error"+err);
    }
}




IntializeConnection();
