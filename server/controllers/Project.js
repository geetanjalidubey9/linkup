const express = require('express');

const path = require('path');
const fs = require('fs');
const Project = require('../models/Project'); // Ensure this path is correct



// Get all projects
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get project by ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Create a new project
const createProject = [
  async (req, res) => {
    const { projectName, applicants, description } = req.body;

    const project = new Project({
      projectName,
    
   
      applicants,
      description
    });

    try {
      const newProject = await project.save();
      res.status(201).json(newProject);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
];

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,

};
