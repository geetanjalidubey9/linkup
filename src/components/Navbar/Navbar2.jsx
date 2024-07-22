// import React, { useState, useEffect,useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { Link } from 'react-router-dom';
// import { FaBell } from 'react-icons/fa';
// import { useSocket } from '../../connection'; 
// import { FaUserCircle } from 'react-icons/fa'; 
// import Cookies from 'js-cookie';
// import { jwtDecode } from "jwt-decode";

// import "./Navbar2.css";

// const Navbar2 = () => {
//   const location = useLocation();
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [profileImage, setProfileImage] = useState(null);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const formOverlayRef = useRef(null);
//   const socket = useSocket();
//   const getToken = () => {
//     const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
//     if (!token) {
//       console.error("No token found");
//       // Handle this case as per your application's requirements
//     }
//     return token;
//   };

//   const getUserId = (token) => {
//     // const token = getToken();
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
  
  

//     const playNotificationSound = () => {
//     const audio = new Audio('/mixkit-software-interface-start-2574.wav'); // Adjust the path based on your file location

//     audio.play();
//   };

//   useEffect(() => {
//     if (!socket) return;
//   socket.on("connect", () => {
//       console.log("Connected to server");
//     });


//     socket.on("send Notification", (data) => {
//       console.log("Notification received:", data);
    
//       playNotificationSound();
//       alert("you are added as member of the group");
//       addNotification();

//     });
    
// socket.on("send priNotification", (data) => {
//   console.log("Notification received:", data);
//   playNotificationSound();
//   addNotification();

// });

// socket.on("send userNotification", (data) => {
//   console.log("Notification received:", data);
//   playNotificationSound();

//   addNotification();

// });


//     socket.on("disconnect", (reason) => {
//       console.log("Disconnected from server:", reason);
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("disconnect");
//       socket.off("send Notification");
//       socket.off("send userNotification");
//     };
//   }, []);

//   const addNotification = () => {
//     console.log(notificationCount)
// setNotificationCount(notificationCount + 1);

//   };


//   useEffect(() => {
//     const fetchProfileImage = async () => {
//       try {
//         let token = localStorage.getItem('token') || Cookies.get('jwt');

//         if (!token) {
//           throw new Error('Token not found');
//         }

//         const response = await fetch('http://localhost:3000/auth/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error('Failed to fetch profile data');
//         }

//         const data = await response.json();
//         setProfileImage(data.avatar); // Assuming `avatar` field is the URL of the profile photo
//       } catch (error) {
//         console.error('Fetch Profile Error:', error.message);
//         // Handle error (e.g., set default profile image or show a placeholder)
//       }
//     };

//     fetchProfileImage();
//   }, []);
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };
//   // Conditional rendering based on location pathname
//   if (
//     !['/home' ,'/chat','/home','/projects','/Notification'].includes(location.pathname) &&
//     !location.pathname.startsWith('/chat')&&
//     !location.pathname.startsWith('/home')
//   ) {
//     return null;
//   }

  

//   return (
//     <nav className="navbar">
//       <div className="navbar__logo">Link-Up</div>
//       <button className="drawer-toggle" onClick={toggleDrawer}>
//         ☰
//       </button>

//       <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
//         <ul className="drawer__list">
          
//           <li>
//             <Link to="/home" className="drawer-link" onClick={toggleDrawer}>
//               Home
//             </Link>
//           </li>
//           <li>
//             <Link  to="/chat" className="drawer-link" onClick={toggleDrawer}>
//           Chats
//             </Link>
//             </li>
//           <li>
//             <Link to="/projects"  className="drawer-link" onClick={toggleDrawer}>
//             Projects
//             </Link>
//             </li>
//             {notificationCount > 0 && (
//               <span className="notification-count">{notificationCount}</span>
//             )}
//           <li>
//             <Link to="/Notification" className="drawer-link" onClick={toggleDrawer}>
//              Notification
//           </Link>
//           </li>
//           </ul>
//       </div>
//       <ul className="navbar__list">
//         <li><Link to="/home" className="nav-link">Home</Link></li>
//         <li><Link to="/chat" className="nav-link">Chats</Link></li>
//         <li><Link to="/projects" className="nav-link">Projects</Link></li>
       
//         <li>
//           <Link to="/Notification" id="fa-bell" className="nav-link">
//             <FaBell />
//             {notificationCount > 0 && (
//               <span className="notification-count">{notificationCount}</span>
//             )}
//           </Link>
//         </li>

//         <li>
//           <Link to="/profile">
//             {profileImage ? (
//               <img src={`http://localhost:3000${profileImage}`} alt="Avatar" className="avatar" crossOrigin="anonymous"/>
//             ) : (
//               <FaUserCircle className="avatar-icon" />
//             )}
//           </Link>
//         </li>
       
//       </ul>
//     </nav>
    
//   );
// }

// export default Navbar2;













import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import Cookies from 'js-cookie';
import {jwtDecode} from 'jwt-decode';
import { useSocket } from '../../connection'; 
import "./Navbar2.css";

const Navbar2 = () => {
  const location = useLocation();
  const [notificationCount, setNotificationCount] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const formOverlayRef = useRef(null);
  const socket = useSocket();

  const getToken = () => {
    const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
    if (!token) {
      console.error("No token found");
      // Handle this case as per your application's requirements
    }
    return token;
  };

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

  const token = getToken();
  const userId = getUserId(token);

  const playNotificationSound = () => {
    const audio = new Audio('/mixkit-software-interface-start-2574.wav');
    audio.play();
  };

  useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("send Notification", (data) => {
      console.log("Notification received:", data);
      playNotificationSound();
      alert("You are added as member of the group");
      addNotification();
    });

    socket.on("send priNotification", (data) => {
      console.log("Notification received:", data);
      playNotificationSound();
      addNotification();
    });

    socket.on("send userNotification", (data) => {
      console.log("Notification received:", data);
      playNotificationSound();
      addNotification();
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("send Notification");
      socket.off("send priNotification");
      socket.off("send userNotification");
    };
  }, [socket]);

  const addNotification = () => {
    setNotificationCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        let token = localStorage.getItem('token') || Cookies.get('jwt');
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
        setProfileImage(data.avatar);
      } catch (error) {
        console.error('Fetch Profile Error:', error.message);
      }
    };

    fetchProfileImage();
  }, []);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const getActiveClass = (path) => (location.pathname === path ? 'active' : '');

  if (
    !['/home', '/chat', '/projects', '/Notification'].includes(location.pathname) &&
    !location.pathname.startsWith('/chat') &&
    !location.pathname.startsWith('/home')
  ) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">Link-Up</div>
      <button className="drawer-toggle" onClick={toggleDrawer}>
        ☰
      </button>

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <ul className="drawer__list">
          <li>
            <Link to="/home" className={`drawer-link ${getActiveClass('/home')}`} onClick={toggleDrawer}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/chat" className={`drawer-link ${getActiveClass('/chat')}`} onClick={toggleDrawer}>
              Chats
            </Link>
          </li>
          <li>
            <Link to="/projects" className={`drawer-link ${getActiveClass('/projects')}`} onClick={toggleDrawer}>
              Projects
            </Link>
          </li>
          <li>
            <Link to="/Notification" className={`drawer-link ${getActiveClass('/Notification')}`} onClick={toggleDrawer}>
              Notification
            </Link>
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
          </li>
        </ul>
      </div>
      <ul className="navbar__list">
        <li>
          <Link to="/home" className={`nav-link ${getActiveClass('/home')}`}>Home</Link>
        </li>
        <li>
          <Link to="/chat" className={`nav-link ${getActiveClass('/chat')}`}>Chats</Link>
        </li>
        <li>
          <Link to="/projects" className={`nav-link ${getActiveClass('/projects')}`}>Projects</Link>
        </li>
        <li>
          <Link to="/Notification" id="fa-bell" className={`nav-link ${getActiveClass('/Notification')}`}>
            <FaBell />
            {notificationCount > 0 && (
              <span className="notification-count">{notificationCount}</span>
            )}
          </Link>
        </li>
        <li>
          <Link to="/profile">
            {profileImage ? (
              <img src={`http://localhost:3000${profileImage}`} alt="Avatar" className="avatar" crossOrigin="anonymous" />
            ) : (
              <FaUserCircle className="avatar-icon" />
            )}
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar2;
