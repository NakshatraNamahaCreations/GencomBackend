const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  metaTitle: {
    type: String,
    required: true,
    trim: true,
  },
  metaDescription: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
 services: [{
    type: String, 
  }],
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
  }],
 extraImage: { type: String }, 
  redirectLink: { type: String, trim: true }, 
  //  city: {
  //   type: String,
  //   enum: ["Mysore", "Bangalore"], 
  //   required: true,
  // },
});

module.exports = mongoose.model('Blog', blogSchema);