const express = require('express');
const router = express.Router();
const projectController = require('../controllers/Project'); // Ensure this path is correct

// Use the serveUploads middleware to serve static files

router.post('/create-projects', projectController.createProject);
router.get('/all-projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getProjectById);


module.exports = router;
