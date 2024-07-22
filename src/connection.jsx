import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import {jwtDecode} from 'jwt-decode';

import Cookies from 'js-cookie';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const getToken = () => {
  const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
  if (!token) {
    console.error("No token found");
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

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = getToken();
    const userId = getUserId(token);

    if (userId) {
      socketRef.current = io("http://localhost:3000", {
        query: {
          user_id: userId,
        },
      });

      setSocket(socketRef.current);

      return () => {
        socketRef.current.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
