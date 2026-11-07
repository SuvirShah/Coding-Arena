const { Worker } = require("bullmq");
const { QUEUE_NAME, connection }=require("../config/queue");
const { judgeSubmission, markInternalError }=require("../services/judgeSubmission");

const startSubmissionWorker = () => {
  const worker = new Worker(
    QUEUE_NAME,
    async (job) => judgeSubmission(job.data.submissionId),
    {
      connection,
      concurrency: 3,     
      limiter: { max: 5, duration: 1000 },
    }
  );

  worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed (attempt ${job?.attemptsMade}):`, err.message);
    if (job && job.attemptsMade >= (job.opts.attempts || 1)) {
      await markInternalError(
        job.data.submissionId,
        "Judge service unavailable. Please submit again."
      ).catch(() => {});
    }
  });

  worker.on("error", (err) => console.error("Worker error:", err.message));

  console.log("Submission worker started");
  return worker;
};

module.exports = startSubmissionWorker;