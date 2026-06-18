const { createClient }=require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'neovivid-silica-golden-94203.db.redis.io',
        port: 16314
    }
});

// client.on('error', err => console.log('Redis Client Error', err));

// await client.connect();

// await client.set('foo', 'bar');
// const result = await client.get('foo');
// console.log(result)

module.exports=redisClient;