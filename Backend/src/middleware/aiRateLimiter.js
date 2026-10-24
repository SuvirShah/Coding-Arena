const redisClient = require("../config/redis");

const MAX_REQUESTS = 15;
const WINDOW_SECONDS = 60;

const aiRateLimiter = async (req, res, next) => {
  try {
    const key = `ai-limit:${req.result._id}`;
    const count = await redisClient.incr(key);
    if (count === 1 || (await redisClient.ttl(key)) === -1) {
      await redisClient.expire(key, WINDOW_SECONDS);
    }
    if (count > MAX_REQUESTS) {
      return res.status(429).json({ message: "Slow down, too many AI requests. Try again in a minute." });
    }
    next();
  } catch (err) {
    console.error("ai rate limiter error:", err.message);
    next();
  }
};

module.exports = aiRateLimiter;