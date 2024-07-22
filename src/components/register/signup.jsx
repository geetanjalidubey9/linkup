import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    collegeName: '',
    userName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    let strength = 0;

    // Password criteria
    const regexList = {
      upperCase: /[A-Z]/,
      lowerCase: /[a-z]/,
      specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
      number: /[0-9]/
    };

    // Check each criteria
    for (let regex in regexList) {
      if (regexList[regex].test(password)) {
        strength++;
      }
    }

    // Set password strength
    if (strength === 4) {
      setPasswordStrength('Very Strong');
    } else if (strength === 3) {
      setPasswordStrength('Strong');
    } else if (strength === 2) {
      setPasswordStrength('Medium');
    } else if (strength === 1) {
      setPasswordStrength('Weak');
    } else {
      setPasswordStrength('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Include confirmPassword field in the request body
    const { confirmPassword, ...restFormData } = formData;

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...restFormData,
          confirmPassword: formData.confirmPassword // Add confirmPassword field
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to sign up');
      }

      const data = await response.json();

      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', data.token);
      }

      console.log('API Response:', response);

      // Show success message
      setSignupSuccess(true);

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <div className="signup-container">
      <div className="inner-signup-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="collegeName"
            placeholder="College Name"
            value={formData.collegeName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={formData.userName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {passwordStrength && <p>Password Strength: {passwordStrength}</p>}
          {errors.password && <p className="error">{errors.password}</p>}
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          {signupSuccess && <p style={{ color: 'green' }}>Sign up successful! Redirecting to login page...</p>}
          <p style={{color:'Black' }}>Already have an account? <Link to="/login">Login</Link></p>
          <br></br>
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;






// import React, { useState } from 'react';
// import './signup.css';
// import { Link } from 'react-router-dom';

// const SignUpPage = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     collegeName: '',
//     userName: '',
//     email: '',
//     password: '',
//     confirmPassword: ''
//   });

//   const [errors, setErrors] = useState({});
//   const [passwordStrength, setPasswordStrength] = useState('');
//   const [signupSuccess, setSignupSuccess] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Check password strength
//     if (name === 'password') {
//       checkPasswordStrength(value);
//     }
//   };

//   const checkPasswordStrength = (password) => {
//     let strength = 0;

//     // Password criteria
//     const regexList = {
//       upperCase: /[A-Z]/,
//       lowerCase: /[a-z]/,
//       specialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/,
//       number: /[0-9]/
//     };

//     // Check each criteria
//     for (let regex in regexList) {
//       if (regexList[regex].test(password)) {
//         strength++;
//       }
//     }

//     // Set password strength
//     if (strength === 4) {
//       setPasswordStrength('Very Strong');
//     } else if (strength === 3) {
//       setPasswordStrength('Strong');
//     } else if (strength === 2) {
//       setPasswordStrength('Medium');
//     } else if (strength === 1) {
//       setPasswordStrength('Weak');
//     } else {
//       setPasswordStrength('');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Include confirmPassword field in the request body
//     const { confirmPassword, ...restFormData } = formData;

//     try {
//       const response = await fetch('http://localhost:3000/auth/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...restFormData,
//           confirmPassword: formData.confirmPassword // Add confirmPassword field
//         }),
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to sign up');
//       }

//       console.log('API Response:', response);

//       // Show success message
//       setSignupSuccess(true);

//       // Redirect to login page after 2 seconds
//       setTimeout(() => {
//         window.location.href = '/login';
//       }, 2000);
//     } catch (error) {
//       console.error('Error:', error.message);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <div className="inner-signup-container">
//         <h2>Sign Up</h2>
//         <form onSubmit={handleSubmit} className="signup-form">
//           <input
//             type="text"
//             name="firstName"
//             placeholder="First Name"
//             value={formData.firstName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="lastName"
//             placeholder="Last Name"
//             value={formData.lastName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="collegeName"
//             placeholder="College Name"
//             value={formData.collegeName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="text"
//             name="userName"
//             placeholder="Username"
//             value={formData.userName}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           {passwordStrength && <p>Password Strength: {passwordStrength}</p>}
//           {errors.password && <p className="error">{errors.password}</p>}
//           <input
//             type="password"
//             name="confirmPassword"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             required
//           />
//           {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
//           {signupSuccess && <p style={{ color: 'green' }}>Sign up successful! Redirecting to login page...</p>}
//           <p style={{color:'Black' }}>Already have an account? <Link to="/login">Login</Link></p>
//           <br></br>
//           <button type="submit" className="signup-button">Sign Up</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUpPage;
