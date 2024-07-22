import React from 'react';
import './settings.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faBell, faCommentDots, faShieldAlt, faDatabase, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <ul className="settings-list">
        <li>
          <FontAwesomeIcon icon={faUser} />
          <span>Account Settings</span>
          <ul>
            <li>Profile</li>
            <li>Change Password</li>
            <li>Manage Devices</li>
          </ul>
        </li>
        <li>
          <FontAwesomeIcon icon={faCommentDots} />
          <span>Chat Settings</span>
          <ul>
            <li>Chat Themes</li>
            <li>Chat Backup</li>
            <li>Blocked Contacts</li>
          </ul>
        </li>
        <li>
          <FontAwesomeIcon icon={faBell} />
          <span>Notifications</span>
          <ul>
            <li>Message Notifications</li>
            <li>Group Notifications</li>
            <li>Sound & Vibration</li>
          </ul>
        </li>
        <li>
          <FontAwesomeIcon icon={faShieldAlt} />
          <span>Privacy</span>
          <ul>
            <li>Last Seen</li>
            <li>Profile Photo</li>
            <li>About</li>
            <li>Status</li>
            <li>Read Receipts</li>
            <li>Two-Step Verification</li>
          </ul>
        </li>
        <li>
          <FontAwesomeIcon icon={faDatabase} />
          <span>Data and Storage</span>
          <ul>
            <li>Network Usage</li>
            <li>Storage Usage</li>
          </ul>
        </li>
        <li>
          <FontAwesomeIcon icon={faQuestionCircle} />
          <span>Help and Support</span>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Report a Problem</li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default Settings;
