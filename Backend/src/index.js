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


app.use(cors({
    origin:"https://codearena-backend-g0bt.onrender.com",
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
