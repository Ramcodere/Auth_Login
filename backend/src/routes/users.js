const express = require('express');
const { 
  updateUserProfile, 
  changePassword, 
  getUserPosts, 
  getUserById 
} = require('../controllers/users');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/:id
router.get('/:id', getUserById);

// @route   PUT /api/users/profile
router.put('/profile', protect, updateUserProfile);

// @route   PUT /api/users/password
router.put('/password', protect, changePassword);

// @route   GET /api/users/posts
router.get('/posts', protect, getUserPosts);

module.exports = router; 