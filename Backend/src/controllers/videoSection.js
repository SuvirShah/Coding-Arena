const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const Problem = require("../models/problems");
const SolutionVideo = require("../models/solutionVideo");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_PUBLIC_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_API_KEY
});

const folderFor = (problemId) => `leetcode-solutions/${problemId}/`;

const buildThumbnailUrl = (publicId) =>
  cloudinary.url(publicId, {
    resource_type: 'video',
    secure: true,
    format: 'jpg',
    transformation: [{ width: 640, crop: 'limit' }]
  });

const generateUploadSignature = async (req, res) => {
    try {
        const { problemId } = req.params;
        const userId = req.result._id;

        if (!mongoose.isValidObjectId(problemId)) {
            return res.status(400).json({ error: "Invalid problem id" });
        }
        const problem = await Problem.findById(problemId).select("_id");
        if (!problem) {
            return res.status(404).json({ error: "Problem doesn't exist" });
        }

        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `${folderFor(problemId)}${userId}_${timestamp}`;
        const uploadParams = {
            timestamp: timestamp,
            public_id: publicId,
        };
        const signature = cloudinary.utils.api_sign_request(
            uploadParams,
            process.env.CLOUDINARY_SECRET_API_KEY
        );
        res.json({
            signature,
            timestamp,
            public_id: publicId,
            api_key: process.env.CLOUDINARY_PUBLIC_API_KEY,
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
        });
    }
    catch (error) {
        console.error('Error generating upload signature:', error);
        res.status(500).json({ error: 'Failed to generate upload credentials' });
    }
};

const saveVideoMetadata = async (req, res) => {
    try {
        const { problemId, cloudinaryPublicId, duration: clientDuration } = req.body;
        const userId = req.result._id;

        if (!mongoose.isValidObjectId(problemId) || typeof cloudinaryPublicId !== 'string') {
            return res.status(400).json({ error: 'problemId and cloudinaryPublicId are required' });
        }

        if (!cloudinaryPublicId.startsWith(folderFor(problemId))) {
            return res.status(400).json({ error: 'Video does not belong to this problem' });
        }

        const problem = await Problem.findById(problemId).select("_id");
        if (!problem) {
            return res.status(404).json({ error: "Problem doesn't exist" });
        }

        //One video solution per problem extra would just waste storeage and resources
        const existingVideo = await SolutionVideo.findOne({ problemId });
        if (existingVideo) {
            return res.status(409).json({ error: 'This problem already has a video. Delete it first.' });
        }

        let cloudinaryResource;
        try {
            cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'video' });
        } catch (e) {
            if (e?.http_code === 404 || e?.error?.http_code === 404) {
                return res.status(400).json({ error: 'Video not found on Cloudinary' });
            }
            throw e;
        }
        // The Admin API doesn't always include `duration`, but the upload response the browser got does.
        // Duration is display-only, so fall back to the browser's value if it is a sane number.
        const reported = Number(cloudinaryResource?.duration);
        const fromClient = Number(clientDuration);
        const duration =
            Number.isFinite(reported) && reported > 0 ? reported
            : Number.isFinite(fromClient) && fromClient > 0 && fromClient < 86400 ? fromClient
            : null;
        if (!duration) {
            return res.status(400).json({ error: 'Could not determine the video duration' });
        }

        // Trust =Cloudinary always nit browser urls
        const videoSolution = await SolutionVideo.create({
            problemId,
            userId,
            cloudinaryPublicId: cloudinaryResource.public_id,
            secureUrl: cloudinaryResource.secure_url,
            duration,
            thumbnailUrl: buildThumbnailUrl(cloudinaryResource.public_id)
        });

        res.status(201).json({
            message: 'Video solution saved successfully',
            videoSolution: {
                id: videoSolution._id,
                thumbnailUrl: videoSolution.thumbnailUrl,
                duration: videoSolution.duration,
                uploadedAt: videoSolution.createdAt
            }
        });
    }
    catch (error) {
        if (error?.code === 11000) {
            return res.status(409).json({ error: 'Video already exists' });
        }
        console.error('Error saving video metadata:', error);
        res.status(500).json({ error: 'Failed to save video metadata' });
    }
};

const deleteVideo = async (req, res) => {
  try {
    const { problemId } = req.params;
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problem id' });
    }

    const video = await SolutionVideo.findOne({ problemId });
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    //First delete from cloudinary then from db if clouidinary fails we can retry later
    const result = await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
      resource_type: 'video',
      invalidate: true
    });
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(502).json({ error: 'Could not delete the video from Cloudinary' });
    }

    await SolutionVideo.deleteOne({ _id: video._id });
    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = { generateUploadSignature, saveVideoMetadata, deleteVideo, buildThumbnailUrl };