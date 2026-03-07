const express = require('express');
const router = express.Router();
const { createBlog, getBlogs, getBlog, updateBlog, deleteBlog, getBlogByTitle, getBlogBySlug    } = require('../Controllers/blogController');
const upload = require('../middleware/upload');

router.post(
  '/',
  upload.fields([{ name: 'bannerImage', maxCount: 1 },
        { name: 'extraImage', maxCount: 1 }, 
  ]),
  createBlog
);


router.get('/', getBlogs);


router.get('/blog/:id', getBlog);

router.get('/blog/slug/:slug', getBlogBySlug);

router.put(
  '/blog/:id',
  upload.fields([{ name: 'bannerImage', maxCount: 1 },
      { name: 'extraImage', maxCount: 1 },
  ]),
  updateBlog
);

router.get('/blog/title/:title', getBlogByTitle);

router.delete('/blog/:id', deleteBlog);

module.exports = router;