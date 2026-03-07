const Blog = require('../models/Blog');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const parseMaybeJSON = (input) => {
  try {
    return typeof input === 'string' ? JSON.parse(input) : input;
  } catch (err) {
    return input;
  }
};

/* -------------------- CREATE BLOG -------------------- */
exports.createBlog = async (req, res) => {
  try {
    const { title, metaTitle, metaDescription, description, services, faqs } = req.body;

if (!title || !req.files.bannerImage || !metaTitle || !metaDescription || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const slug = generateSlug(title);

    const existing = await Blog.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Slug already exists. Use a different title.' });
    }

const newBlog = new Blog({
  title,
  slug,
  bannerImage: req.files.bannerImage[0].path,
  extraImage: req.files.extraImage ? req.files.extraImage[0].path : null,
  metaTitle,
  metaDescription,
  description,
  services: parseMaybeJSON(services),
  faqs: parseMaybeJSON(faqs),
  redirectLink: req.body.redirectLink || null,
});


    await newBlog.save();

    cache.flushAll();

    res.status(201).json({ success: true, message: 'Blog created successfully.' });
  } catch (err) {
    console.error('Blog creation failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* -------------------- GET BLOGS WITH PAGINATION + CACHE -------------------- */
exports.getBlogs = async (req, res) => {
  try {
   const { service, page = 1, limit = 10 } = req.query;

const filter = {};
if (service) filter.services = { $in: [service] };

const cacheKey = `blogs_${service || 'all'}_${page}_${limit}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ 
        success: true, 
        data: cachedData.data, 
        totalDocuments: cachedData.totalDocuments, 
        totalPages: cachedData.totalPages, 
        currentPage: Number(page), 
        cache: true 
      });
    }

    const skip = (page - 1) * limit;
    const totalDocuments = await Blog.countDocuments(filter);
    const totalPages = Math.ceil(totalDocuments / limit);

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const result = { data: blogs, totalDocuments, totalPages };

    // Save to cache
    cache.set(cacheKey, result);

    res.status(200).json({
      success: true,
      ...result,
      currentPage: Number(page),
      cache: false,
    });
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


/* -------------------- GET BLOG BY SLUG -------------------- */
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const cacheKey = `blog_slug_${slug}`;
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.status(200).json({ success: true, data: cached, cache: true });
    }

    const blog = await Blog.findOne({ slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found." });
    }

    cache.set(cacheKey, blog);

    res.status(200).json({ success: true, data: blog, cache: false });
  } catch (err) {
    console.error("Failed to fetch blog by slug:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};


/* -------------------- GET SINGLE BLOG -------------------- */
exports.getBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check cache first
    const cacheKey = `blog_${id}`;
    const cachedBlog = cache.get(cacheKey);
    if (cachedBlog) {
      return res.status(200).json({ success: true, data: cachedBlog, cache: true });
    }

    const blog = await Blog.findById(id).select(
 'title bannerImage metaTitle metaDescription description services faqs extraImage redirectLink'
);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    // Save to cache
    cache.set(cacheKey, blog);

    res.status(200).json({ success: true, data: blog, cache: false });
  } catch (err) {
    console.error('Failed to fetch blog:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* -------------------- GET BLOG BY TITLE -------------------- */
exports.getBlogByTitle = async (req, res) => {
  try {
    let { title } = req.params;
    title = title.replace(/-/g, ' ');

    const cacheKey = `blog_title_${title}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.status(200).json({ success: true, data: cached, cache: true });
    }

    const blog = await Blog.findOne({
      title: { $regex: `^${title}$`, $options: 'i' },
    }).select('title bannerImage metaTitle metaDescription description createdAt');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    cache.set(cacheKey, blog);

    res.status(200).json({ success: true, data: blog, cache: false });
  } catch (err) {
    console.error('Failed to fetch blog by title:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* -------------------- UPDATE BLOG -------------------- */
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, metaTitle, metaDescription, description, services, faqs } = req.body;

    if (!title || !metaTitle || !metaDescription || !description) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    const updateData = {
      title,
      metaTitle,
      metaDescription,
      description,
      services: parseMaybeJSON(services),
      faqs: parseMaybeJSON(faqs),
      redirectLink: req.body.redirectLink || null,
     
    };

    if (req.files?.bannerImage) {
  updateData.bannerImage = req.files.bannerImage[0].path;
}

if (req.files?.extraImage) {
  updateData.extraImage = req.files.extraImage[0].path;
}

    const blog = await Blog.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    // Invalidate cache
    cache.flushAll();

    res.status(200).json({ success: true, message: 'Blog updated successfully.' });
  } catch (err) {
    console.error('Blog update failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/* -------------------- DELETE BLOG -------------------- */
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found.' });
    }

    // Invalidate cache after deletion
    cache.flushAll();

    res.status(200).json({ success: true, message: 'Blog deleted successfully.' });
  } catch (err) {
    console.error('Blog deletion failed:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};
