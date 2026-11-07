const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const mongoose=require("mongoose");
const { getSubmissionQueue } = require("../config/queue");
const { getLanguageById, mapJudgeStatus ,submitBatch, submitToken } = require("../utils/ProblemUtility");

const MAX_PENDING_PER_USER = 3;
// Languages the Submission schema accepts (getLanguageById knows a few more, e.g. python)
const STORABLE_LANGUAGES = Submission.schema.path("language").enumValues;

const submitCode = async (req, res) => {
  let submission;
  try {
    const userId = req.result._id;
    const problemId = req.params.id;
    const { code, language } = req.body;

    if (!code || !language) {
      return res.status(400).send("Mandatory Fields Missing");
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).send("Invalid problem id");
    }
    try {
      getLanguageById(language);
    } catch (e) {
      return res.status(400).send(e.message);
    }
    if (!STORABLE_LANGUAGES.includes(language)) {
      return res.status(400).send(`Unsupported language: ${language}`);
    }

    const problem = await Problem.findById(problemId).select("hiddenTestCases");
    if (!problem) return res.status(404).send("Problem not found");

  
    const recentPending = await Submission.countDocuments({
      userId,
      status: "pending",
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });
    if (recentPending >= MAX_PENDING_PER_USER) {
      return res.status(429).send("Too many submissions in progress. Wait for them to finish.");
    }

    submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      totalTestCases: problem.hiddenTestCases.length,
    });

    // jobId = submissionId, so the same submission can never be queued twice
    await getSubmissionQueue().add(
      "judge",
      { submissionId: submission._id.toString() },
      { jobId: submission._id.toString() }
    );

    return res.status(202).send({ submissionId: submission._id, status: "pending" });
  } catch (err) {
    if (submission) {
      await Submission.updateOne(
        { _id: submission._id },
        { $set: { status: "internal error", errorMessage: "Could not queue submission" } }
      ).catch(() => {});
    }
    return res.status(500).send("Error " + err.message);
  }
};

const getSubmissionStatus = async (req, res) => {
  try {
    const { submissionId } = req.params;
    if (!mongoose.isValidObjectId(submissionId)) {
      return res.status(400).send("Invalid submission id");
    }

    const submission = await Submission.findOne({ _id: submissionId, userId: req.result._id }).lean();
    if (!submission) return res.status(404).send("Submission not found");

    if (submission.status === "pending") {
      return res.status(200).send({ status: "pending" });
    }

    
    return res.status(200).send({
      status: submission.status,
      accepted: submission.status === "accepted",
      passedTestCases: submission.testCasesPassed,
      totalTestCases: submission.totalTestCases,
      runtime: submission.runtime,
      memory: submission.memory,
      error: submission.errorMessage,
      submission,
    });
  } catch (err) {
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

module.exports = { submitCode, getSubmissionStatus, runCode };