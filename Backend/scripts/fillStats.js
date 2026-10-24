const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const mongoose = require("mongoose");
const User = require("../src/models/user");
const Problem = require("../src/models/problems");

(async () => {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  const users = await User.find({});
  for (const u of users) {
    const solved = await Problem.find({ _id: { $in: u.problemSolved } }).select("difficulty");
    const stats = { solved: solved.length, easy: 0, medium: 0, hard: 0 };
    for (const p of solved) if (stats[p.difficulty] !== undefined) stats[p.difficulty]++;
    await User.updateOne({ _id: u._id }, { $set: { stats } });
  }
  console.log(`Backfilled ${users.length} users`);
  await mongoose.disconnect();
})();