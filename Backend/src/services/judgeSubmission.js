const mongoose=require('mongoose');
const Problem=require("../models/problems");
const User=require("../models/user");
const Submission=require("../models/submission");
const { getLanguageById, mapJudgeStatus, submitBatch, submitToken } = require("../utils/ProblemUtility");

const markInternalError=(submssionId,message)=>{
    Submission.updateOne(
        {_id:submssionId,status:'pending'},
        {$set:{status:'internal error',errorMessage:message}}
    )
}

const judgeSubmission = async (submissionId) => {
  const submission = await Submission.findById(submissionId);
  if (!submission) return;

  if (submission.status !== "pending") return;

  const problem = await Problem.findById(submission.problemId).select("hiddenTestCases difficulty");
  if (!problem) {
    await markInternalError(submissionId, "Problem no longer exists");
    return;
  }

  const language_id = getLanguageById(submission.language);

  const batch = problem.hiddenTestCases.map((tc) => ({
    source_code: submission.code,
    language_id,
    stdin: tc.input,
    expected_output: tc.output,
  }));
  const created = await submitBatch(batch);
  const results = await submitToken(created.map((c) => c.token));

  let testCasesPassed = 0;
  let runtime = 0;
  let memory = 0;
  let status = "accepted";
  let errorMessage = "";

  for (const test of results) {
    runtime += parseFloat(test.time || 0);
    memory = Math.max(memory, test.memory || 0);
    if (test.status_id === 3) {
      testCasesPassed++;
    } else if (status === "accepted") {
      status = mapJudgeStatus(test.status_id);
      errorMessage = (test.stderr || test.compile_output || test.message || "Execution failed").slice(0, 2000);
    }
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const updated = await Submission.updateOne(
        { _id: submissionId, status: "pending" },
        { $set: { status, testCasesPassed, errorMessage, runtime, memory } },
        { session }
      );
      if (updated.modifiedCount === 0) return;

      if (status === "accepted") {
        const inc = { "stats.solved": 1 };
        if (["easy", "medium", "hard"].includes(problem.difficulty)) {
          inc[`stats.${problem.difficulty}`] = 1;
        }
        await User.updateOne(
          { _id: submission.userId, problemSolved: { $ne: submission.problemId } },
          { $addToSet: { problemSolved: submission.problemId }, $inc: inc },
          { session }
        );
      }
    });
  } finally {
    await session.endSession();
  }
};

module.exports = { judgeSubmission, markInternalError };
