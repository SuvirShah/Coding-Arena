const express = require("express");
const aiRouter = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const aiRateLimiter = require("../middleware/aiRateLimiter");
const solveDoubt = require("../controllers/solveDoubt");

aiRouter.post("/chat", userMiddleware, aiRateLimiter, solveDoubt);

module.exports = aiRouter;