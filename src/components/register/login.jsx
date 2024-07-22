import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './login.css';
import Cookies from 'js-cookie';



export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const { token } = await response.json();
      Cookies.set('jwt', token, { expires: 7 });
      localStorage.setItem('jwt', token);

      console.log('Login successful');
   
      window.location.href = '/home';
    } catch (error) {
      console.error('Login Error:', error);
      setError('Invalid email or password');
    }
  };

  return (
    <div className="container">
      <div className="login-container">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} required />
          <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} required />
          <button type="submit">Login</button>
        </form>
        <p>
            <Link to="/forgot-password" className="forgot-password-link">
             Forgot Password?
           </Link>
</p>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}













// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import './login.css';
// import Cookies from 'js-cookie';
// import io from 'socket.io-client';

// // Import js-cookie
// const socket = io('http://localhost:3000');
// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState(null);

//   const handleEmailChange = (e) => {
//     setEmail(e.target.value);
//   };

//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch('http://localhost:3000/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       if (!response.ok) {
//         throw new Error('Invalid email or password');
//       } else {
//         const data = await response.json();
//         const { token } = data; // Assuming your server responds with a token in JSON format

//         // Store token in cookies
//         Cookies.set('jwt', token, { expires: 7 }); // Expires in 7 days

//         // Store token in localStorage
//         localStorage.setItem('jwt', token);

//         console.log('Login successful');
//         // Redirect to home page after successful login
//         window.location.href = '/home';
//       }
//     } catch (error) {
//       console.error('Error:', error.message);
//       setError('Invalid email or password'); // Set error message state
//     }
//   };

//   // Debug code to check token in cookies
//   const cookieToken = Cookies.get('jwt');
//   console.log('Token from cookies:', cookieToken);

//   // Debug code to check token in localStorage
//   const localStorageToken = localStorage.getItem('jwt');
//   console.log('Token from localStorage:', localStorageToken);
// // Emit login event to the server with the userId
 
//   return (
//     <div className="container">
//       <div className="login-container">
//         <h2>Login</h2>
//         {error && <p className="error-message">{error}</p>}
//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={handleEmailChange}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={handlePasswordChange}
//             required
//           />
//           <p>
//             <Link to="/forgot-password" className="forgot-password-link">
//               Forgot Password?
//             </Link>
//           </p>
//           <button type="submit">Login</button>
//         </form>
//         <p>
//           Don't have an account?{' '}
//           <Link to="/signup" className="signup-link">
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }




















