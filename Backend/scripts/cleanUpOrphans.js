// Removes data left behind by problems that were deleted before deleteProblem cleaned up after itself.
// DRY RUN by default (only prints). Add --apply to actually delete.
//   node Backend/scripts/cleanupOrphans.js
//   node Backend/scripts/cleanupOrphans.js --apply
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const mongoose = require("mongoose");
const Problem = require("../src/models/problems");
const Submission = require("../src/models/submission");
const SolutionVideo = require("../src/models/solutionVideo");
const { destroyCloudinaryVideo } = require("../src/controllers/videoSection");

const APPLY = process.argv.includes("--apply");

(async () => {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  const existing = await Problem.distinct("_id");

  const orphanSubs = await Submission.countDocuments({ problemId: { $nin: existing } });
  const orphanVideos = await SolutionVideo.find({ problemId: { $nin: existing } });

  console.log(`${APPLY ? "APPLYING" : "DRY RUN"}: ${orphanSubs} orphan submissions, ${orphanVideos.length} orphan videos`);

  if (APPLY) {
    await Submission.deleteMany({ problemId: { $nin: existing } });
    for (const v of orphanVideos) {
      const removed = await destroyCloudinaryVideo(v.cloudinaryPublicId);
      if (removed) {
        await SolutionVideo.deleteOne({ _id: v._id });
      } else {
        console.log(`Could not delete Cloudinary asset ${v.cloudinaryPublicId}, kept its record`);
      }
    }
    console.log("Done");
  } else {
    console.log("Nothing deleted. Re-run with --apply to clean up.");
  }
  await mongoose.disconnect();
})();