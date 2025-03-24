const express = require('express');
const { 
  createComment, 
  updateComment, 
  deleteComment, 
  toggleLike 
} = require('../controllers/comments');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/comments
router.post('/', protect, createComment);

// @route   PUT /api/comments/:id
router.put('/:id', protect, updateComment);

// @route   DELETE /api/comments/:id
router.delete('/:id', protect, deleteComment);

// @route   POST /api/comments/:id/like
router.post('/:id/like', protect, toggleLike);

module.exports = router; 