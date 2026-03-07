const Gallery = require("../models/Gallery");

/* UPLOAD IMAGE */
exports.uploadImage = async (req, res) => {
  try {

    const { imageName } = req.body;

    const image = new Gallery({
      imageName,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });

    await image.save();

    res.json({
      success: true,
      message: "Image uploaded successfully",
      data: image
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });

  }
};


/* GET IMAGES */
exports.getImages = async (req, res) => {

  try {

    const images = await Gallery.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: images
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch images"
    });

  }

};


/* UPDATE IMAGE + NAME */
exports.updateImage = async (req, res) => {

  try {

    const { id } = req.params;
    const { imageName } = req.body;

    const image = await Gallery.findById(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    if (imageName) {
      image.imageName = imageName;
    }

    if (req.file) {
      image.imageUrl = req.file.path;
      image.publicId = req.file.filename;
    }

    await image.save();

    res.json({
      success: true,
      message: "Image updated successfully",
      data: image
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Update failed"
    });

  }

};


/* DELETE IMAGE */
exports.deleteImage = async (req, res) => {

  try {

    const { id } = req.params;

    const image = await Gallery.findByIdAndDelete(id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found"
      });
    }

    res.json({
      success: true,
      message: "Image deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Delete failed"
    });

  }

};