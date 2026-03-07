const express = require("express");
const router = express.Router();

const galleryUpload = require("../middleware/galleryUpload");

const {
  uploadImage,
  getImages,
  updateImage,
  deleteImage
} = require("../Controllers/galleryController");


/* UPLOAD */
router.post(
  "/upload",
  galleryUpload.single("image"),
  uploadImage
);

/* GET */
router.get("/", getImages);

/* UPDATE */
router.put(
  "/update/:id",
  galleryUpload.single("image"),
  updateImage
);

/* DELETE */
router.delete("/delete/:id", deleteImage);

module.exports = router;