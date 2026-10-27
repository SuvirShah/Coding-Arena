const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env"), quiet: true });
const mongoose = require("mongoose");
const SolutionVideo = require("../src/models/solutionVideo");
const { buildThumbnailUrl } = require("../src/controllers/videoSection");

(async () => {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  const videos = await SolutionVideo.find({});
  let fixed = 0;
  for (const v of videos) {
    
    if (!v.thumbnailUrl || !v.thumbnailUrl.startsWith("https://")) {
      v.thumbnailUrl = buildThumbnailUrl(v.cloudinaryPublicId);
      await v.save();
      fixed++;
    }
  }
  console.log(`Checked ${videos.length} videos, fixed ${fixed}`);
  await mongoose.disconnect();
})();