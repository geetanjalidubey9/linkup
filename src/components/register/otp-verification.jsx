
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import Cookies from 'js-cookie'; 
import './otp-verification.css';

const OTPVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [otpExpired, setOTPExpired] = useState(false);
  const [remainingTime, setRemainingTime] = useState(5 * 60); // 5 minutes in seconds

  const getToken = () => {
    const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
    if (!token) {
      console.error("No token found");
    }
    return token;
  };

  const getUserId = () => {
    const token = getToken();
    if (!token) return null;

    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.userId;
    } catch (error) {
      console.error("Invalid token:", error.message);
      return null;
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          setOTPExpired(true);
          clearInterval(timer);
          return 0;
        }
      });
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const handleResendOTP = async () => {
    const token = getToken();
    const userId = getUserId(token);
    if (!email) {
      setError('Email is required.');
      return;
    }
    try {
      await axios.post('http://localhost:3000/auth/send-otp',
      { email,userId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setOTPExpired(false);
      setRemainingTime(5 * 60); // Reset remaining time to 5 minutes
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while resending OTP.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/verify', 
        { email, otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );
      console.log('OTP Verified:', response.data);
      // Handle successful OTP verification, e.g., redirect to dashboard
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred while verifying OTP.');
    }
  };

  return (
    <div className='container'>
      <h2>OTP Verification</h2>
      <p>An OTP has been sent to your email. Please enter it below.</p>
      <form onSubmit={handleSubmit}>
        <label>
          Enter Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={otpExpired}
          />
        </label>
        <label>
          Enter OTP:
          <input
            type="text"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
            required
            disabled={otpExpired}
          />
        </label>
        {otpExpired && <p style={{ color: 'red' }}>The OTP has expired. Please request a new one.</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p>Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}</p>
        <button type="submit" disabled={otpExpired}>Verify OTP</button>
      </form>
      <button className='resend-otp' onClick={handleResendOTP} >
        Resend OTP
      </button>
    </div>
  );
};

export default OTPVerificationPage;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode';
// import Cookies from 'js-cookie'; 
// import './otp-verification.css';

// const OTPVerificationPage = () => {
//   const [email, setEmail] = useState('');
//   const [otp, setOTP] = useState('');
//   const [error, setError] = useState('');
//   const [otpExpired, setOTPExpired] = useState(false);
//   const [remainingTime, setRemainingTime] = useState(2 * 60); // 5 minutes in seconds



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

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setRemainingTime(prevTime => {
//         if (prevTime > 0) {
//           return prevTime - 1;
//         } else {
//           setOTPExpired(true);
//           clearInterval(timer);
//           return 0;
//         }
//       });
//     }, 1000); // Update every second

//     return () => clearInterval(timer);
//   }, []);

//   const handleResendOTP = async () => {
//     const token = getToken();
//     const userId = getUserId(token);
//     if (!email) {
//       setError('Email is required.');
//       return;
//     }
//     try {
//       await axios.post('http://localhost:3000/auth/send-otp',

//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       setOTPExpired(false);
//       setRemainingTime(2* 60); // Reset remaining time
//       setError('');
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred while resending OTP.');
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:3000/auth/verify', 
        
//         { 
//         email, otp

//          },
//       {
//         headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",}
//           },
//  );
//       console.log('OTP Verified:', response.data);
//       // Handle successful OTP verification, e.g., redirect to dashboard
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred while verifying OTP.');
//     }
//   };

//   return (
//     <div className='container'>
//       <h2>OTP Verification</h2>
//       <p>An OTP has been sent to your email. Please enter it below.</p>
//       <form onSubmit={handleSubmit}>
//         <label>
//           Enter Email:
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             disabled={otpExpired}
//           />
//         </label>
//         <label>
//           Enter OTP:
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOTP(e.target.value)}
//             required
//             disabled={otpExpired}
//           />
//         </label>
//         {otpExpired && <p style={{ color: 'red' }}>The OTP has expired. Please request a new one.</p>}
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//         <p>Time remaining: {Math.floor(remainingTime / 60)}:{remainingTime % 60 < 10 ? '0' : ''}{remainingTime % 60}</p>
//         <button type="submit" disabled={otpExpired}>Verify OTP</button>
//       </form>
//       <button className='resend-otp' onClick={handleResendOTP} disabled={otpExpired}>
//         Resend OTP
//       </button>
//     </div>
//   );
// };

// export default OTPVerificationPage;
