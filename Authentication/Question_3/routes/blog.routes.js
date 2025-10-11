
const express = require('express');
const Blog = require('../models/Blog');
const auth = require('../middleware/authMiddleware');
const BlogRouter = express.Router();

// Create Blog
BlogRouter.post('/', auth, async (req, res) => {
  try {
    const blog = await Blog.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get User Blogs
BlogRouter.get('/', auth, async (req, res) => {
  const blogs = await Blog.find({ createdBy: req.user._id });
  res.json(blogs);
});

// Update Blog
BlogRouter.put('/:id', auth, async (req, res) => {
  const blog = await Blog.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user._id },
    req.body,
    { new: true }
  );
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json(blog);
});

// Delete Blog
BlogRouter.delete('/:id', auth, async (req, res) => {
  const blog = await Blog.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  res.json({ message: 'Blog deleted' });
});

// Aggregation Route
BlogRouter.get('/stats', auth, async (req, res) => {
  try {
    const totalBlogs = await Blog.countDocuments();

    const blogsPerUser = await Blog.aggregate([
      { $group: { _id: '$createdBy', count: { $sum: 1 } } },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: { _id: 0, user: '$user.name', count: 1 } }
    ]);

    const commonTags = await Blog.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    res.json({ totalBlogs, blogsPerUser, commonTags });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = BlogRouter;
