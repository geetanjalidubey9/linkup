import React, { useState } from 'react';
import "./contact.css"

const ContactUsPage = () => {
  // State to manage form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your logic to handle form submission here
    console.log(formData); // Example: You can log or send the form data to an API
    // Clear form fields after submission
    setFormData({
      name: '',
      email: '',
      message: ''
    });
  };

  // Function to handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
  <div>
    
    <div className='contact-container'>

      
     <div className='contact'>
     <h1>Contact Us
     </h1>
      <h2>We are here to Support you!</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum, totam eum. Ullam, doloribus maiores. Itaque!</p>
 </div>
      <div className='support'>
        <h1>Get Support</h1>
        {/* Contact form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">What can we help you:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>

</div>
{/* <div className='Contact-info'>
      <div>
        <h3>Contact Information</h3>
        <p>
          Customer Support: <a href="mailto:support@linkup.com">support@linkup.com</a>
        </p>
        <p>
          Technical Support: <a href="mailto:techsupport@linkup.com">techsupport@linkup.com</a>
        </p>
        <p>
          Business Inquiries: <a href="mailto:business@linkup.com">business@linkup.com</a>
        </p>
      </div>

      <div className='social-info'>
        <h3>Connect With Us</h3>
       
        <ul>
          <li>
            Twitter: <a href="https://twitter.com/LinkUpApp">@LinkUpApp</a>
          </li>
          <li>
            Facebook: <a href="https://www.facebook.com/LinkUpApp">Link Up</a>
          </li>
          <li>
            LinkedIn: <a href="https://www.linkedin.com/company/linkupapp">Link Up</a>
          </li>
        </ul>
      </div>

      <div>
        <h3>Our Location</h3>
        <p>123 Main Street</p>
        <p>Washington, 12345</p>
        <p>USA</p>
       
      </div>

      
    </div> */}
</div>


  );
};

export default ContactUsPage;
