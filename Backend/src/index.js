const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
// require("dotenv").config();
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
const helmet=require("helmet");



const allowedOrigins = [
    "http://localhost:5173",
    "https://coding-arena-q2hl.vercel.app"
];
app.set('trust proxy',1);
app.use(helmet());
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

app.use(express.json({limit:'50kb'}));
app.use(cookieParser());
app.get('/health', (req, res) => {
    res.status(200).send('Backend is healthy and running');
});
app.use("/user",authRouter);
app.use("/problem",ProblemRouter);
app.use("/submission",submitRouter);
app.use('/ai',aiRouter);
app.use("/video",videoRouter);

let worker;

const IntializeConnection=async()=>{

    try{
        await Promise.all([main(),redisClient.connect()])
        console.log("DB Connected");

        app.listen(PORT,()=>{
        console.log(`Server Listening at ${PORT}`);
        })
        if (process.env.RUN_WORKER !== "false") {
            const startSubmissionWorker = require("./workers/submissionWorker");
            worker = startSubmissionWorker();
        }
    }
    catch(err){
        console.log("Error"+err);
    }
}
const shutdown = async () => {
    try { await worker?.close(); } finally { process.exit(0); }
};


if (process.env.NODE_ENV !== 'test') {
    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
    IntializeConnection();
}
module.exports = app;
