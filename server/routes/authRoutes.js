const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register first admin account
// @access  Public
router.post('/register', authController.register);

// @route   POST /api/auth/login
// @desc    Authenticate admin & get token
// @access  Public
router.post('/login', authController.login);

// @route   GET /api/auth/verify
// @desc    Verify active session
// @access  Private
router.get('/verify', authMiddleware, authController.verify);

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
router.post('/refresh', authController.refresh);

// @route   POST /api/auth/logout
// @desc    Logout and clear cookies
// @access  Public
router.post('/logout', authController.logout);

router.post('/recover', authController.recover);

router.post('/update-password', authController.updatePassword);

module.exports = router;
