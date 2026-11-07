const {Queue}=require('bullmq');

const QUEUE_NAME="submissions";

const connection={
      host: process.env.REDIS_HOST || "leafy-charming-suit-66606.db.redis.io",
        port: Number(process.env.REDIS_PORT) || 10519,
        username: "default",
        password: process.env.REDIS_PASS,
}

let queue;

const getSubmissionQueue=()=>{
    if(!queue){
        queue=new Queue(QUEUE_NAME,{
            connection,
            defaultJobOptions:{
                attempts:3,
                backoff:{type:'exponential',delay:2000},
                removeOnComplete:{age:3600,count:1000},
                removeOnFail: { age: 24 * 3600 }
            }
        })
        queue.on("error", (err) => console.error("Queue error:", err.message));
    }
    return queue;
}
module.exports={QUEUE_NAME,connection,getSubmissionQueue};