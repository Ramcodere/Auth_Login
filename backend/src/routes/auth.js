const express = require('express');
const { register, login, getUserProfile } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/auth/register
router.post('/register', register);

// @route   POST /api/auth/login
router.post('/login', login);

// @route   GET /api/auth/profile
router.get('/profile', protect, getUserProfile);

module.exports = router; 