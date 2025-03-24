const express = require('express');
const { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost, 
  toggleLike 
} = require('../controllers/posts');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
router.get('/', getPosts);

// @route   POST /api/posts
router.post('/', protect, createPost);

// @route   GET /api/posts/:id
router.get('/:id', getPostById);

// @route   PUT /api/posts/:id
router.put('/:id', protect, updatePost);

// @route   DELETE /api/posts/:id
router.delete('/:id', protect, deletePost);

// @route   POST /api/posts/:id/like
router.post('/:id/like', protect, toggleLike);

module.exports = router; 