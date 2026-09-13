const { createClient } = require("redis");

// const redisClient = createClient({
//     username: 'default',
//     password: process.env.REDIS_PASS,
//     socket: {
//         host: 'refreshing-tree-range-14648.db.redis.io',
//         port: 18479
//     }
// });
const redisClient = createClient({
    username: 'default',
    password: 'process.env.REDIS_PASS',
    socket: {
        host: 'leafy-charming-suit-66606.db.redis.io',
        port: 10519
    }
});

module.exports = redisClient;