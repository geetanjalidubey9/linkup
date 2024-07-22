// import React, { useState } from 'react';
// import './reset-password.css'; // Import your CSS file here
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// const ResetPasswordPage = () => {
//   const [formData, setFormData] = useState({
//     newPassword: '',
//     confirmNewPassword: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [message, setMessage] = useState('');

//   const getToken = () => {
//     const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
//     if (!token) {
//       console.error("No token found");
//     }
//     return token;
//   };

//   const getUserId = () => {
//     const token = getToken();
//     if (!token) return null;

//     try {
//       const decodedToken = jwtDecode(token);
//       return decodedToken.userId;
//     } catch (error) {
//       console.error("Invalid token:", error.message);
//       return null;
//     }
//   };
//   const token = getToken();
//   const userId = getUserId(token);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     // Reset password logic here
//     // Check if new password and confirm new password match
//     if (formData.newPassword !== formData.confirmNewPassword) {
//       setErrors({ confirmPassword: 'Passwords do not match' });
//       return;
//     }
  
  
  
//     try {
//       const response = await fetch("http://localhost:3000/auth/reset-password", {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           password: formData.newPassword,
//           passwordConfirm: formData.confirmNewPassword,
//           token: token
//         }),
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         setMessage(data.message);
//         setErrors({});
//         setFormData({ newPassword: '', confirmNewPassword: '' });
//       } else {
//         const data = await response.json();
//         setErrors({ confirmPassword: data.message });
//         setMessage('');
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       setErrors({ confirmPassword: 'Something went wrong. Please try again later.' });
//       setMessage('');
//     }
//   };
  

//   return (
//     <div className="reset-password-container">
//       <h2>Reset Password</h2>
//       <form onSubmit={handleSubmit} className="reset-password-form">
//         <input
//           type="password"
//           name="newPassword"
//           placeholder="New Password"
//           value={formData.newPassword}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="confirmNewPassword"
//           placeholder="Confirm New Password"
//           value={formData.confirmNewPassword}
//           onChange={handleChange}
//           required
//         />
//         {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
//         {message && <p className="success">{message}</p>}
//         <button type="submit" className="reset-password-button">Reset Password</button>
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordPage;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './reset-password.css'; // Import your CSS file here
import {jwtDecode} from 'jwt-decode'; // Correctly import jwtDecode

const ResetPasswordPage = () => {
  const { resetToken } = useParams(); // Retrieve token from URL params
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmNewPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Optional: You can verify the token here or perform additional checks
  }, [resetToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if new password and confirm new password match
    if (formData.newPassword !== formData.confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match' });
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/auth/reset-password/${resetToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.newPassword,
          passwordConfirm: formData.confirmNewPassword
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setErrors({});
        setFormData({ newPassword: '', confirmNewPassword: '' });
      
      } else {
        const data = await response.json();
        setErrors({ confirmNewPassword: data.message });
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setErrors({ confirmNewPassword: 'Something went wrong. Please try again later.' });
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmNewPassword"
          placeholder="Confirm New Password"
          value={formData.confirmNewPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmNewPassword && <p className="error">{errors.confirmNewPassword}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit" className="reset-password-button">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
