const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const mongoose=require("mongoose");
const { getLanguageById, mapJudgeStatus ,submitBatch, submitToken } = require("../utils/ProblemUtility");

const submitCode = async (req, res) => {
  let submission;
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).send("Mandatory Fields Missing");
    }

    const problem = await Problem.findById(problemId).select("hiddenTestCases difficulty");
    if (!problem) return res.status(404).send("Problem not found");

    const language_id = getLanguageById(language);

    submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      totalTestCases: problem.hiddenTestCases.length,
    });

    const batch = problem.hiddenTestCases.map((tc) => ({
      source_code: code,
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
        // record the first failure only
        status = mapJudgeStatus(test.status_id);
        errorMessage = test.stderr || test.compile_output || test.message || "Execution failed";
      }
    }

    let firstSolve = false;
    const session = await mongoose.startSession();
    try {
      await session.withTransaction(async () => {
        firstSolve = false; // callback can be retried by the driver
        await Submission.updateOne(
          { _id: submission._id },
          { $set: { status, testCasesPassed, errorMessage, runtime, memory } },
          { session }
        );

        if (status === "accepted") {
          const inc = { "stats.solved": 1 };
          if (["easy", "medium", "hard"].includes(problem.difficulty)) {
            inc[`stats.${problem.difficulty}`] = 1;
          }
          // the $ne filter makes "first solve" atomic under concurrent submits
          const r = await User.updateOne(
            { _id: userId, problemSolved: { $ne: problemId } },
            { $addToSet: { problemSolved: problemId }, $inc: inc },
            { session }
          );
          firstSolve = r.modifiedCount === 1;
        }
      });
    } finally {
      await session.endSession();
    }

    const saved = await Submission.findById(submission._id).lean();

    return res.status(201).send({
      accepted: status === "accepted",
      firstSolve,
      passedTestCases: testCasesPassed,
      totalTestCases: problem.hiddenTestCases.length,
      runtime,
      memory,
      error: errorMessage,
      submission: saved,
    });
  } catch (err) {
    if (submission) {
      await Submission.updateOne(
        { _id: submission._id },
        { $set: { status: "internal error", errorMessage: err.message } }
      ).catch(() => {});
    }
    return res.status(500).send("Error " + err.message);
  }
};

const runCode = async (req, res) => {
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!userId || !problemId || !code || !language) {
      return res.status(400).send("Mandatory Fields Missing");
    }

    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).send("Problem not found");
    }

    const language_id = getLanguageById(language);

    const submissions = problem.visibleTestCases.map((testcase) => ({
      source_code: code,
      language_id,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((val) => val.token);
    const testResult = await submitToken(resultToken);

    let success = true;
    let runtime = 0;
    let memory = 0;

    const showResult = testResult.map((test, idx) => {
      if (test.status_id != 3) {
        success = false;
      }

      runtime += parseFloat(test.time || 0);
      memory = Math.max(memory, test.memory || 0);

      return {
        testCaseNo: idx + 1,
        stdin: problem.visibleTestCases[idx]?.input,
        expected_output: problem.visibleTestCases[idx]?.output,
        stdout: test.stdout || test.compile_output || test.stderr || "",
        status_id: test.status_id,
      };
    });

    return res.status(201).send({
      success,
      runtime,
      memory,
      testCases: showResult,
    });
  } catch (err) {
    return res.status(500).send("Error " + err.message);
  }
};

module.exports = { submitCode, runCode };