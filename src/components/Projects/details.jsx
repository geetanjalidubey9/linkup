import React from 'react';
import { useParams } from 'react-router-dom';
import Projectlogo from '../../assets/projectlogo.png';
import './details.css';

const ProjectDetails = () => {
  const { id } = useParams(); // Get the project ID from URL params

  // Placeholder project details - Replace with actual data fetched from the server
  const projectDetails = {
    id: 1,
    collegeName: "ABC College",
    projectName: 'Real-Time Chat Application',
    duration: '3 months',
    isPaid: true,
    stipend: 10000, // Placeholder for the stipend amount
    logo: Projectlogo,
    applicants: 242, // Placeholder for the number of applicants
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam convallis nisi ut massa dictum, eget rutrum sem sollicitudin. Cras vulputate sem vitae nulla accumsan, vel fermentum risus facilisis. Integer et mauris vel magna suscipit vestibulum id nec arcu. Fusce eleifend, magna vel sollicitudin laoreet, velit tellus consequat mauris, nec fermentum arcu eros sed nisi.'
  };

  // If you have actual data coming from the server, you can fetch it here using the project ID

  return (
    <div className="project-details">
      <h2>Project</h2>
      <div className='detail-container'>
        <img src={projectDetails.logo} alt="Project Logo" />
        <div>
          <h3>{projectDetails.projectName}</h3>
          <p><strong>College:</strong> {projectDetails.collegeName}</p>
          <p><strong>Duration:</strong> {projectDetails.duration}</p>
          <p><strong>{projectDetails.isPaid ? 'Stipend:' : 'Unpaid'}</strong> {projectDetails.isPaid ? `₹ ${projectDetails.stipend} /month` : ''}</p>
          <p><strong>Applicants:</strong> {projectDetails.applicants}</p>
          {/* <p><strong>Description:</strong> {projectDetails.description}</p> */}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
