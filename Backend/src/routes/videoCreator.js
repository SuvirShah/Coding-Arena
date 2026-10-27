const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/videoSection");
const rateLimiter = require('../middleware/rateLimiter');

videoRouter.get("/create/:problemId",adminMiddleware,rateLimiter,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,rateLimiter,saveVideoMetadata);
videoRouter.delete("/delete/:problemId",adminMiddleware,rateLimiter,deleteVideo);


module.exports = videoRouter;