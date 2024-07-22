import React, { useState, useEffect } from 'react';
import './profilepage.css';
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import Navbar2 from '../Navbar/Navbar2';
import Cookies from 'js-cookie';

const ProfileForm = () => {
  const [formData, setFormData] = useState({
    userName: '',
    firstName: '',
    lastName: '',
    collegeName: '',
    email: '',
    avatar: null, // Will hold either a File object or a string (URL)
    degree: '',
    collegeid: null, // Will hold a File object for the college ID PDF
    collegeYear: '',
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        let token = localStorage.getItem('token');
        if (!token) {
          token = Cookies.get('jwt');
        }

        if (!token) {
          throw new Error('Token not found');
        }

        const response = await fetch('http://localhost:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setFormData({
          userName: data.userName,
          firstName: data.firstName,
          lastName: data.lastName,
          collegeName: data.collegeName,
          email: data.email,
          avatar: data.avatar, // Assuming `avatar` field is the URL of the profile photo
          degree: data.degree || '',
          collegeid: data.collegeid || null,
          collegeYear: data.collegeYear || '',
        });
      } catch (error) {
        console.error('Fetch Profile Error:', error.message);
        // Handle error (e.g., show error message to user)
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('photo', file);

      let token = localStorage.getItem('token');
      if (!token) {
        token = Cookies.get('jwt');
      }

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://localhost:3000/auth/profile/uploadphoto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      console.log('Photo uploaded successfully');
      toast.success('Profile photo updated successfully!');
      // Optionally update the avatar URL in the state after successful upload
      const data = await response.json();
      setFormData((prevFormData) => ({ ...prevFormData, avatar: data.avatar }));
    } catch (error) {
      console.error('Upload Photo Error:', error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleCollegeIdChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, collegeid: file });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('userName', formData.userName);
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('collegeName', formData.collegeName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('degree', formData.degree);
      formDataToSend.append('collegeYear', formData.collegeYear);
      formDataToSend.append('collegeid', formData.collegeid);

      let token = localStorage.getItem('token');
      if (!token) {
        token = Cookies.get('jwt');
      }

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://localhost:3000/auth/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      console.log('Profile updated successfully');
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Update Profile Error:', error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  // const handleAddDetails = async () => {
  //   try {
  //     const formDataToSend = new FormData();
  //     formDataToSend.append('degree', formData.degree);
  //     formDataToSend.append('collegeYear', formData.collegeYear);
  //     formDataToSend.append('collegeid', formData.collegeid);

  //     let token = localStorage.getItem('token');
  //     if (!token) {
  //       token = Cookies.get('jwt');
  //     }

  //     if (!token) {
  //       throw new Error('Token not found');
  //     }

  //     const response = await fetch('http://localhost:3000/auth/profile/details', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: formDataToSend,
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to add additional details');
  //     }

  //     console.log('Additional details added successfully');
  //     // Optionally update state or notify user on successful addition
  //   } catch (error) {
  //     console.error('Add Additional Details Error:', error.message);
  //     // Handle error (e.g., show error message to user)
  //   }
  // };

  return (
    <div>
      <Navbar2 />
      <div className='profile-container'>
        <h1>My Profile</h1>
        <div className="avatar-container">
          {formData.avatar ? (
            <img src={formData.avatar instanceof File ? URL.createObjectURL(formData.avatar) : `http://localhost:3000${formData.avatar}`} alt="Profile" className="avatar" crossOrigin="anonymous"/>
          ) : (
            <FontAwesomeIcon icon={faUserCircle} size="6x" className="avatar" />
          )}
          <label htmlFor="upload-profile-pic">
            <FontAwesomeIcon icon={faCamera} className="camera-icon" />
          </label>
          <input
            id="upload-profile-pic"
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
          <span className="username">{formData.userName}</span>
        </div>

        <form onSubmit={handleSubmit} className='profile-form'>
          <input
            type='text'
            name='userName'
            placeholder='Username'
            value={formData.userName}
            onChange={handleChange}
            readOnly
            required
          />
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='collegeName'
            placeholder='College Name'
            value={formData.collegeName}
            onChange={handleChange}
            required
          />
          <input
            type='email'
            name='email'
            placeholder='Email'
            value={formData.email}
            onChange={handleChange}
            readOnly
            required
          />
          <input
            type='text'
            name='degree'
            placeholder='Degree'
            value={formData.degree}
            onChange={handleChange}
            required
          />
          <input
            type='text'
            name='collegeYear'
            placeholder='College Year'
            value={formData.collegeYear}
            onChange={handleChange}
            required
          />
          <label htmlFor="upload-college-id">
            Upload College ID Image (PDF only):
          </label>
          <input
            id="upload-college-id"
            type="file"
            name="collegeid"
            accept=".pdf||jpeg||jpg"
            onChange={handleCollegeIdChange}
            required
          />
          {formData.collegeid && (
            <div className="file-selected">
              <span>{formData.collegeid.name}</span>
              <button type="button" onClick={() => setFormData({ ...formData, collegeid: null })}>
                <FontAwesomeIcon icon={faTimes} className="cancel-icon" />
              </button>
            </div>
          )}

          <button className="submit" type='submit'>Update Profile</button>
          {/* <button className="add-details" type='button' onClick={handleAddDetails}>Add Additional Details</button> */}
        </form>
      </div>
    </div>
  );
};

export default ProfileForm;
