import React, { useState ,useEffect } from 'react';
import './Chatleftbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle,faUserFriends, faComments, faClipboardList, faCogs, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const LeftBar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [verified, setVerified] = useState(false);

  const toggleDrawerfun = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to log out');
      }

      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    const fetchUserVerificationStatus = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include your authentication token if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setVerified(data.verified);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserVerificationStatus();
  }, []);
  
  return (
    <div>
      <button className="drawer-toggleleftbar" onClick={toggleDrawerfun}>
        ☰
      </button>
      <div className={`drawers ${isDrawerOpen ? 'open' : ''}`}>
        <ul className="drawer__lists">
          <li>
            <FontAwesomeIcon icon={faUserFriends} />
            <a href="/home/search-group" className="drawer-links">Serach Groups</a>
          </li>
          <li>
            <FontAwesomeIcon icon={faComments} />
            <a href="/home/friends" className="drawer-links">Friend</a>
          </li>
          <li>
            <FontAwesomeIcon icon={faClipboardList} />
            <a href="#" className="drawer-links">Your Applications</a>
          </li>
          <li>
            <FontAwesomeIcon icon={faCogs} />
            <a href="/settings" className="drawer-links">Settings</a>
          </li>
          <li>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <a href="#" className="drawer-links" onClick={handleLogout}>Logout</a>
          </li>
        </ul>
      </div>

      <div className='left-bar'>
        <div className='left-container'>
          <ul className="left-list">
            <li>
              <FontAwesomeIcon icon={faUserFriends} />
              <a href="/home/search-group" className="left-link">Search Groups</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faComments} />
              <a href="/home/friends" className="left-link">Friend</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faClipboardList} />
              <a href="#" className="left-link">Your Applications</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faCogs} />
              <a href="/home/settings" className="left-link">Settings</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faSignOutAlt} />
              <a href="#" className="left-link" onClick={handleLogout}>Logout</a>
            </li>
            {/* <li>
              <FontAwesomeIcon icon={faCheckCircle} />
              <a href="/verification" id="verify" className="left-link">verify yourself</a>
            </li> */}

<li>
              <FontAwesomeIcon
                icon={faCheckCircle}
                className={verified ? 'verified-icon' : 'unverified-icon'}
              />
              <a href="/verification" id="verify" className={`left-link ${verified ? 'disabled-link' : ''}`}>
                verify yourself
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LeftBar;
