const Problem = require("../models/problems");
const User = require("../models/user");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/ProblemUtility");

const submitCode = async (req, res) => {
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

    const submittedResult = await Submission.create({
      userId,
      problemId,
      code,
      language,
      testCasesPassed: 0,
      status: "pending",
      totalTestCases: problem.hiddenTestCases.length,
    });

    const language_id = getLanguageById(language);

    const submissions = problem.hiddenTestCases.map((testcase) => ({
      source_code: code,
      language_id,
      stdin: testcase.input,
      expected_output: testcase.output,
    }));

    const submitResult = await submitBatch(submissions);
    const resultToken = submitResult.map((val) => val.token);
    const testResult = await submitToken(resultToken);

    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errmessage = "";

    for (const test of testResult) {
      if (test.status_id == 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        if (test.status_id == 4) {
          status = "error";
        } else {
          status = "wrong result";
        }
        errmessage = test.stderr || test.compile_output || test.message || "Execution failed";
      }
    }

    submittedResult.status = status;
    submittedResult.testCasesPassed = testCasesPassed;
    submittedResult.errorMessage = errmessage;
    submittedResult.runtime = runtime;
    submittedResult.memory = memory;

    await submittedResult.save();

    if (
      status === "accepted" &&
      !req.result.problemSolved.some((id) => id.toString() === problemId.toString())
    ) {
      req.result.problemSolved.push(problemId);
      await req.result.save();
    }

    return res.status(201).send({
      accepted: status === "accepted",
      passedTestCases: testCasesPassed,
      totalTestCases: problem.hiddenTestCases.length,
      runtime,
      memory,
      error: errmessage,
      submission: submittedResult,
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

module.exports = { submitCode, runCode };