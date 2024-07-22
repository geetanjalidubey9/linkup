import React, { useState } from 'react';
import './forgot-password.css'; // Assuming you have a CSS file for styling
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";



const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const getToken = () => {
    const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
    if (!token) {
      console.error("No token found");
    }
    return token;
  };

  // Function to decode token and retrieve userId
  const getUserId = (token) => {
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Invalid token:", error.message);
      return null;
    }
  };


  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    const token = getToken();
    const userId = getUserId(token);
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage(data.message);
        setError('');
      } else {
        const data = await response.json();
        setError(data.message);
        setMessage('');
      }
    } catch (error) {
      console.error('Error:', error.message);
      setError('Something went wrong. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="reset-password-form">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={handleChange}
          required
        />
        <button type="submit">Send</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;

