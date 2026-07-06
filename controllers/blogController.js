import Blog from '../models/Blog.js';
import { uploadImage } from '../services/cloudinary.js';

// @desc    Get all blogs (with optional filter, search, pagination)
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 6 } = req.query;

    const query = {};

    // Filter by category
    if (category && category !== 'All') {
      query.category = category;
    }

    // Full text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const totalBlogs = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: blogs.length,
      totalPages: Math.ceil(totalBlogs / parseInt(limit)),
      currentPage: parseInt(page),
      totalBlogs,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res, next) => {
  try {
    const blogData = { ...req.body };

    // If tags come in as a comma-separated string, convert to array
    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map((t) => t.trim());
    }

    // Handle image upload
    if (req.file) {
      blogData.image = await uploadImage(req.file.path);
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    const blogData = { ...req.body };

    if (typeof blogData.tags === 'string') {
      blogData.tags = blogData.tags.split(',').map((t) => t.trim());
    }

    if (req.file) {
      blogData.image = await uploadImage(req.file.path);
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, blogData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    next(error);
  }
};
