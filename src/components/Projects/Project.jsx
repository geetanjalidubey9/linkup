import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Project.css';

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3000/project/all-projects");
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProjects = projects.filter(project => {
    return project.projectName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="project-section">
       <div className="create-bar">
        
      <div className="search-bar">
     
        <Link to="/projects/create-project" className="create-project-btn">Create Project</Link>

        <input
          type="text"
          placeholder="Search Projects..."
          value={searchTerm}
          onChange={handleSearchInputChange}
        />
      </div>
      </div>
      <div className="project-list">
        {filteredProjects.map(project => (
          <div className="project-card" key={project._id}>
            <img src={"http://localhost:3000/project/uploads"} alt={project.projectName} className="project-logo" />
            <div className="project-info">
              <h3>{project.projectName}</h3>
              <p>Duration: {project.duration}</p>
           
              <p>Applicants: {project.applicants}</p>
              <Link to={`/projects/${project._id}`} className="view-details">View Details</Link>
            </div>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default ProjectSection;
