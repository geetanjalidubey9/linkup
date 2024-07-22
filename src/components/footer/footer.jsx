import React from 'react';
import "./footer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Import FontAwesomeIcon from fontawesome library
import { faInstagram, faFacebook, faTwitter, faGithub } from '@fortawesome/free-brands-svg-icons'; // Import necessary social media icons

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <h1>Link-Up</h1> {/* Display website name */}
        <div className="social-icons">
          
          <a href="https://www.instagram.com/your_instagram_handle" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a href="https://www.facebook.com/your_facebook_page" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="https://twitter.com/your_twitter_handle" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a href="https://github.com/your_github_username" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
