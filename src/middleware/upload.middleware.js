// const multer = require("multer");
// const cloudinary = require("cloudinary").v2;
// const { Readable } = require("stream");

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ── Use memoryStorage (store file in buffer, not disk) ────────
// const storage = multer.memoryStorage();

// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed!"), false);
//   }
// };

// const upload = multer({
//   storage,
//   fileFilter,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

// // ── Upload buffer to Cloudinary ───────────────────────────────
// const uploadToCloudinary = (buffer) => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: "rozgar-hub/profiles",
//         transformation: [
//           { width: 400, height: 400, crop: "fill", gravity: "face" },
//         ],
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     // Convert buffer to readable stream and pipe to cloudinary
//     const readable = new Readable();
//     readable.push(buffer);
//     readable.push(null);
//     readable.pipe(stream);
//   });
// };

// module.exports = { upload, uploadToCloudinary };

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ── multer-storage-cloudinary v4 requires async params function ──
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folderMap = {
      profilePhoto:   "rozgarhub/profile_photos",
      cnicFront:      "rozgarhub/cnic_front",
      cnicBack:       "rozgarhub/cnic_back",
      drivingLicense: "rozgarhub/driving_licenses",
    };

    return {
      folder:          folderMap[file.fieldname] || "rozgarhub/documents",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      public_id:       `${Date.now()}_${file.fieldname}`,
    };
  },
});

// ── File filter ──
const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg", "image/jpg", "image/png",
    "image/webp", "application/pdf",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG, WEBP, and PDF files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// ── Worker: 3 fields ──
const uploadWorkerDocs = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "cnicFront",    maxCount: 1 },
  { name: "cnicBack",     maxCount: 1 },
]);

// ── Employer: 3 fields ──
const uploadEmployerDocs = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "cnicFront",    maxCount: 1 },
  { name: "cnicBack",     maxCount: 1 },
]);

module.exports = { uploadWorkerDocs, uploadEmployerDocs };