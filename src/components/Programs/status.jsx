import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './status.css'; // Import your CSS file

const socket = io('http://localhost:3000'); // Replace with your Socket.IO server URL

const Status = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('user-online', (onlineUserId) => {
      if (onlineUserId === userId) {
        setIsOnline(true);
      }
    });

    socket.on('user-offline', (offlineUserId) => {
      if (offlineUserId === userId) {
        setIsOnline(false);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [userId]);

  return (
    <div className="status-container">
      <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}></div>
      <p className="status-text">{isOnline ? 'Online' : 'Offline'}</p>
    </div>
  );
};

export default Status;
