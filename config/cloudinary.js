  require("dotenv").config();

  const cloudinary = require("cloudinary").v2;

  // Debug log (remove after confirming it works)
  console.log("🔎 Cloudinary ENV Check:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Loaded ✅" : "Missing ❌",
    api_key: process.env.CLOUDINARY_API_KEY ? "Loaded ✅" : "Missing ❌",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded ✅" : "Missing ❌",
  });

  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
  ) {
    throw new Error("❌ Cloudinary environment variables are missing.");
  }

  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  module.exports = cloudinary;