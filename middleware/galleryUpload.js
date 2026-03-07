const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "gallery", // separate folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => {
      return `gallery-${Date.now()}`;
    },
  },
});

const galleryUpload = multer({
  storage: galleryStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = galleryUpload;