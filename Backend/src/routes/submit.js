const express = require("express");
const userMiddleware = require("../middleware/userMiddleware");
const { submitCode, getSubmissionStatus, runCode } = require("../controllers/userSubmission");
const rateLimiter = require("../middleware/rateLimiter");

const submitRouter = express.Router();

submitRouter.post("/submit/:id", userMiddleware, rateLimiter, submitCode);
submitRouter.get("/status/:submissionId", userMiddleware, rateLimiter, getSubmissionStatus);
submitRouter.post("/run/:id", userMiddleware, rateLimiter, runCode);

module.exports = submitRouter;
