const axios = require("axios");

const JUDGE0_BASE_URL = process.env.JUDGE0_URL || "https://judge0-ce.p.rapidapi.com";

const judge0Headers = () => ({
  "x-rapidapi-key": process.env.JUDGE0_RAPID_API_KEY,
  "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
  "Content-Type": "application/json",
});

const LANGUAGE_IDS = {
  "c++": 54,
  cpp: 54,
  java: 62,
  javascript: 63,
  js: 63,
  python: 71,
  py: 71,
};

const getLanguageById = (lang) => {
  const id = LANGUAGE_IDS[lang?.toLowerCase()];
  if (!id) throw new Error(`Unsupported language: ${lang}`);
  return id;
};

const mapJudgeStatus = (statusId) => {
  if (statusId === 3) return "accepted";
  if (statusId === 4) return "wrong result";
  if (statusId === 5) return "tle";
  if (statusId === 6) return "compilation error";
  if (statusId >= 7 && statusId <= 12) return "runtime error";
  return "internal error";
};

const submitBatch = async (submissions) => {
  const response = await axios.post(
    `${JUDGE0_BASE_URL}/submissions/batch`,
    { submissions },
    {
      params: { base64_encoded: "false" },
      headers: judge0Headers(),
      timeout: 10000,
    }
  );
  return response.data;
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const submitToken = async (tokens, { maxAttempts = 15, baseDelayMs = 700 } = {}) => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await axios.get(`${JUDGE0_BASE_URL}/submissions/batch`, {
      params: { tokens: tokens.join(","), base64_encoded: "false", fields: "*" },
      headers: judge0Headers(),
      timeout: 10000,
    });

    const { submissions } = response.data;
    if (submissions.every((s) => s.status_id > 2)) return submissions;

    await wait(Math.min(baseDelayMs * 1.5 ** attempt, 3000));
  }
  throw new Error("Judge0 timed out while waiting for results");
};

module.exports = { getLanguageById, mapJudgeStatus, submitBatch, submitToken };