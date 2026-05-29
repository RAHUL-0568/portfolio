const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/contact
// @desc    Submit public contact inquiry
// @access  Public
router.post('/', contactController.submitInquiry);

// @route   GET /api/contact/inquiries
// @desc    List all contact logs
// @access  Private (Admin Only)
router.get('/inquiries', authMiddleware, contactController.getInquiries);

// @route   PUT /api/contact/inquiries/:id
// @desc    Mark inquiry as read
// @access  Private (Admin Only)
router.put('/inquiries/:id', authMiddleware, contactController.markRead);

// @route   DELETE /api/contact/inquiries/:id
// @desc    Delete inquiry
// @access  Private (Admin Only)
router.delete('/inquiries/:id', authMiddleware, contactController.deleteInquiry);

module.exports = router;
