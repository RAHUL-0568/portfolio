const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Get all projects
router.get('/', projectController.getAllProjects);

// Get featured projects
router.get('/featured', projectController.getFeaturedProjects);

// Create custom project
router.post('/', authMiddleware, projectController.createProject);

// Update project
router.put('/:id', authMiddleware, projectController.updateProject);

// Delete project
router.delete('/:id', authMiddleware, projectController.deleteProject);

module.exports = router;
