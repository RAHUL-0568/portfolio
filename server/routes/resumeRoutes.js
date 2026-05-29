const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const resumeController = require('../controllers/resumeController');
const authMiddleware = require('../middleware/authMiddleware');

// Setup multer storage for temporary pdf uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Filter to accept PDF only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Ensure uploads folder exists
const fs = require('fs');
if (!fs.existsSync('uploads/')) {
  fs.mkdirSync('uploads/');
}

// @route   GET /api/resume/metadata
// @desc    Get all active portfolio and resume metadata
// @access  Public
router.get('/metadata', resumeController.getMetadata);

// @route   PUT /api/resume/metadata
// @desc    Update active portfolio metadata
// @access  Private (Admin Only)
router.put('/metadata', authMiddleware, resumeController.updateMetadata);

// @route   POST /api/resume/upload
// @desc    Upload new resume and parse text dynamically
// @access  Private (Admin Only)
router.post('/upload', authMiddleware, upload.single('resume'), resumeController.uploadAndParseResume);

module.exports = router;
