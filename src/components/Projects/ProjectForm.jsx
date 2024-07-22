import React, { useState } from 'react';
import './ProjectForm.css'; // Import the CSS file

const CreateProjectForm = () => {
  const [formData, setFormData] = useState({
    projectName: '',
    logo: null,
    applicants: 0,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : (type === 'file' ? files[0] : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await fetch("http://localhost:3000/project/create-projects", {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to create project');
      }

      alert('Project created successfully');
      setFormData({
        projectName: '',
      
      
        logo: null,
        applicants: 0,
        description: ''
      });
    } catch (error) {
      console.error(error);
      alert('Failed to create project');
    }
  };

  return (
    <div className="create-project-container">
      <div className="inner-create-project-container">
        <h2>Create Project</h2>
        <form className="create-project-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="projectName">Project Name:</label>
            <input type="text" id="projectName" name="projectName" value={formData.projectName} onChange={handleChange} required />
          </div>
          
          
         
          <div>
            <label htmlFor="logo">Logo:</label>
            <input type="file" id="logo" name="logo" onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="applicants">Applicants:</label>
            <input type="number" id="applicants" name="applicants" value={formData.applicants} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <button type="submit">Create Project</button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectForm;
