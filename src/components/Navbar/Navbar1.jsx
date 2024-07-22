
// import React, { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import "./Navbar1.css";

// const Navbar1 = () => {
//   const location = useLocation();
//   const [drawerOpen, setDrawerOpen] = useState(false);

//   // Toggle function for opening/closing the drawer
//   const toggleDrawer = () => {
//     setDrawerOpen(!drawerOpen);
//   };

//   if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/contact-us"&& location.pathname !== "/about-us") {
//          return null;
//       }
//   return (
//     <nav className="navbar">
//       <div className="navbar__logo">Link-Up</div>
//       {/* Render side drawer toggle button */}
//       <button className="drawer-toggle" onClick={toggleDrawer}>
//         ☰
//       </button>

//       <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
//         <ul className="drawer__list">
//           <li>
//             <Link to="/career" className="drawer-link" onClick={toggleDrawer}>
//               Career
//             </Link>
//           </li>
//           <li>
//             <Link to="/about-us" className="drawer-link" onClick={toggleDrawer}>
//               About
//             </Link>
//           </li>
//           <li>
//             <Link to="/contact-us" className="drawer-link" onClick={toggleDrawer}>
//               Contact Us
//             </Link>
//           </li>
//           <li>
//             <Link to="/login" className="drawer-link" onClick={toggleDrawer}>
//               Login
//             </Link>
//           </li>
//           <li>
//             <Link to="/signup" className="drawer-link" onClick={toggleDrawer}>
//               Signup
//             </Link>
//           </li>
//         </ul>
//       </div>

//       <ul className="navbar__list">
//         <li><Link to="/career" className="nav-link">Career</Link></li>
//         <li><Link to="/about-us" className="nav-link">About</Link></li>
//         <li><Link to="/contact-us" className="nav-link">Contact Us</Link></li>
//         <li><Link to="/login" className="nav-link">Login</Link></li>
//         <li><Link to="/signup" className="nav-link">Signup</Link></li>
//       </ul>
//     </nav>
//   );
// };

// export default Navbar1;


import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import "./Navbar1.css";

const Navbar1 = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Toggle function for opening/closing the drawer
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  if (location.pathname !== "/" && location.pathname !== "/login" && location.pathname !== "/signup" && location.pathname !== "/contact-us" && location.pathname !== "/about-us") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar__logo">Link-Up</div>
      {/* Render side drawer toggle button */}
      <button className="drawer-toggle" onClick={toggleDrawer}>
        ☰
      </button>

      <div className={`drawer ${drawerOpen ? 'open' : ''}`}>
        <ul className="drawer__list">
          <li>
            <Link to="/career" className={`drawer-link ${location.pathname === '/career' ? 'active' : ''}`} onClick={toggleDrawer}>
              Career
            </Link>
          </li>
          <li>
            <Link to="/about-us" className={`drawer-link ${location.pathname === '/about-us' ? 'active' : ''}`} onClick={toggleDrawer}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact-us" className={`drawer-link ${location.pathname === '/contact-us' ? 'active' : ''}`} onClick={toggleDrawer}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/login" className={`drawer-link ${location.pathname === '/login' ? 'active' : ''}`} onClick={toggleDrawer}>
              Login
            </Link>
          </li>
          <li>
            <Link to="/signup" className={`drawer-link ${location.pathname === '/signup' ? 'active' : ''}`} onClick={toggleDrawer}>
              Signup
            </Link>
          </li>
        </ul>
      </div>

      <ul className="navbar__list">
        <li>
          <Link to="/career" className={`nav-link ${location.pathname === '/career' ? 'active' : ''}`}>
            Career
          </Link>
        </li>
        <li>
          <Link to="/about-us" className={`nav-link ${location.pathname === '/about-us' ? 'active' : ''}`}>
            About
          </Link>
        </li>
        <li>
          <Link to="/contact-us" className={`nav-link ${location.pathname === '/contact-us' ? 'active' : ''}`}>
            Contact Us
          </Link>
        </li>
        <li>
          <Link to="/login" className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
            Login
          </Link>
        </li>
        <li>
          <Link to="/signup" className={`nav-link ${location.pathname === '/signup' ? 'active' : ''}`}>
            Signup
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar1;
