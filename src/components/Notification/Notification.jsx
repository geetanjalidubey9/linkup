import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode"; // Corrected import statement
import "./Notification.css";
import { useSocket } from "../../connection";
import axios from "axios";

const NotificationPage = () => {
  const [joinRequests, setJoinRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);

  const socket = useSocket();

  // Function to retrieve token from localStorage or Cookies
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

  useEffect(() => {
    const token = getToken();
    const userId = getUserId(token);

    const fetchAllJoinRequests = async () => {
      if (!userId || !socket) return;

      try {
        const response = await axios.get(`http://localhost:3000/chats/join-request/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch join requests");
        }

        const requestData = response.data.joinRequests || []; // Ensure you are accessing the correct data structure
        console.log("Fetch All Join Requests:", requestData);
        setJoinRequests(requestData); // Update joinRequests state with the fetched data
      } catch (error) {
        console.error("Fetch All Join Requests Error:", error.message);
      }
    };

    const fetchAllFriendRequests = async () => {
      if (!userId) return;

      try {
        const response = await axios.get(`http://localhost:3000/chats/friend-request/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch friend requests");
        }

        const requestData = response.data.friendRequests || []; // Ensure you are accessing the correct data structure
        console.log("Fetch All Friend Requests:", requestData);
        console.log(requestData);
        setFriendRequests(requestData); // Update friendRequests state with the fetched data
      } catch (error) {
        console.error("Fetch All Friend Requests Error:", error.message);
      }
    };



    fetchAllJoinRequests();
    fetchAllFriendRequests();
    // Socket event handling
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
      });

      socket.on("send Notdata", (data) => {
        console.log("Notification received:", data);
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      });
      socket.on("send userNotdata", (data) => {
        console.log("Notification received:", data);
        setNotifications((prevNotifications) => [data, ...prevNotifications]);
      });


      socket.on("disconnect", (reason) => {
        console.log("Disconnected from server:", reason);
      });

      return () => {
        socket.off("connect");
        socket.off("disconnect");
      };
    }
  }, [socket]);

  const handleJoinGroup = async (groupId,requesterId) => {
    try {
      const token = getToken();
      const userId = getUserId(token);

      const response = await axios.put(`http://localhost:3000/chats/groupadd`, {
        chatId: groupId,
        userId: userId,
        requesterId:requesterId
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('Response Data:', response.data);

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to join group");
      }

    } catch (error) {
      console.error("Error joining group:", error.message);
    }
  };

  const handleAcceptFriendRequest = async (requesterId) => {
    try {
      const token = getToken();
      const userId = getUserId(token);

      const response = await axios.put(`http://localhost:3000/chats/accept-request`, {
        userId: userId,
        requesterId: requesterId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('Response Data:', response.data);

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to accept friend request");
      }

      // Update the friendRequests state to remove the accepted request
      setFriendRequests(friendRequests.filter(request => request.requesterId !== requesterId));
    } catch (error) {
      console.error("Error accepting friend request:", error.message);
    }
  };





  return (
    <div className="notification-page">
      <h2>Notifications</h2>
      {joinRequests.length === 0 ? (
        <p></p>
      ) : (
        <ul className="join-requests-list">
          {joinRequests.map((group, index) => (
           
            <li key={`group-${index}`} className="group-item">
              
              <h3>{group.chatName}</h3>
              <ul className="request-list">
                {group.requests.map((request, idx) => (
                  <li key={`request-${idx}`} className="join-request-item">
                    
                    <div className="request-details">
                      <p>{request.requesterName} wants to join</p>
                      
                      <button
                        className="accept-btn"
                        onClick={() => handleJoinGroup(group.chatId , request.requesterId)} // Pass the group ID here
                      >
                        Accept
                      </button>
                      <button className="reject-btn">Reject</button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

{friendRequests.length === 0 ? (
        <p></p>
      ) : (
        <ul className="friend-requests-list">
          {friendRequests.map((request, index) => (
            <li key={`friend-request-${index}`} className="friend-request-item">
              <div className="request-details">
                <p>{request.userName} sent you a friend request</p>
                <button
                  className="accept-btn"
                  onClick={() => handleAcceptFriendRequest(request.user)}
                >
                  Accept
                </button>
                <button
                  className="reject-btn"
                  onClick={() => handleRejectFriendRequest(request.requesterId)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}




      <div className="notifications-container">
     
        <ul className="notifications-list">
          {notifications.map((notification, index) => (
            <li key={`notification-${index}`} className="notification-item">
              <p>{notification.chatName}</p>
              <p>{notification.userName}</p>
              <div className="request-details">
                <button className="accept-btn">Accept</button>
                <button className="reject-btn">Reject</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationPage;
