import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {jwtDecode} from "jwt-decode";
import { useSocket } from "../../connection";
import axios from "axios";
import { faSmile, faUserCircle, faFile } from "@fortawesome/free-solid-svg-icons";
import './friend.css';


const FriendsList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [active, setActive] = useState(false); // For sliding effect
  const {} = location.state || {};
  const socket = useSocket();
  const navigate = useNavigate();

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

  useEffect(() => {
    setActive(true); // Trigger the sliding effect
    
    const token = getToken();
    const userId = getUserId(token);
    const fetchChats = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`http://localhost:3000/chats/AllUsergroups/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch chats');
        }

        const chatsData = response.data; // Adjust this line based on your actual response structure
        console.log("Fetch All User Chats:", chatsData);
        setChats(chatsData || []); // Ensure you are accessing the correct data structure
      } catch (error) {
        console.error('Fetch Chats Error:', error.message);
      }
    };
console.log("hjyuj",setChats);
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/chats/AllUserfriends/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch friends');
        }

        const friendsData = response.data; // Adjust this line based on your actual response structure
        console.log("Fetch All User Friends:", friendsData);
        setFriends(friendsData.friends || []); // Ensure you are accessing the correct data structure
      } catch (error) {
        console.error('Fetch Friends Error:', error.message);
      }
    };

    fetchChats();
    fetchFriends();
  }, []);

  const handleMessageClick = async (friendId, userName, profileImage, isGroupChat) => {
    socket.emit('join chat', friendId);
    console.log("ghfty", friendId);
  
    try {
      const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
      const userId = getUserId(token);
  
      if (!userId) {
        console.error("User ID not found");
        return;
      }
  
      const response = await axios.get(`http://localhost:3000/messages/${userId}/${friendId}`, {
        params: { userId, chatId: friendId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const { conversation } = response.data;
        console.log("jhjgghj",conversation);

      if (response.status === 200) {
        const { conversation } = response.data;
        console.log(conversation);
  
        if (conversation && conversation._id) {
          const conversationName =
            conversation.kind === "group"
              ? conversation.groupName
              : conversation.participants.find((p) => p.user._id !== userId)?.userName;
 
          navigate(`/chat/${conversation._id}`, {
            state: {
             
              chatId:friendId,
              conversation,
              conversationName,
            },
          });
        } else {
          console.error("No conversation found or conversation ID not found");
          console.log(friendId);
          navigate(`/chat/${friendId}`, {
            state: {
              chatId:friendId,
              userName,
              profileImage,
              isGroupChat
            },
          });
        }
      } else {
        console.error("Failed to check conversation");
      }
    } catch (error) {
      console.error("Error in handleMessageClick:", error.message);
    }
  };
  
    const filteredFriends = friends.filter((friend) =>
    friend.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredChats = chats.filter((chat) =>
    chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`friends-container ${active ? 'active' : ''}`}>
     <input
        type="text"
        placeholder="Search friends and groups"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      
       {filteredFriends.length > 0 && (

      // {friends.length > 0 ? (
        <ul className="friends-list">
       
          {friends.map((friend) => (
            <li key={friend._id}>
              <div className="friend-info">
              <div className="profile-image">
             
             <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
           
               </div>
                <span>{friend.userName}</span>
              </div>
              <button className="message-button" onClick={() => handleMessageClick(friend._id, friend.userName, friend.profileImage)}>Message</button>
            </li>
          ))}
        </ul>
       )}
{filteredChats.length > 0 && (
      // {chats.length > 0 ? (
        <ul className="chats-list">
          {chats.map((chat) => (
            <li key={chat._id}>
              <div className="chat-info">
              <div className="profile-image">
             
             <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
           
               </div>
                <span>{chat.chatName}</span>
              </div>
              <button className="message-button" onClick={() => handleMessageClick(chat._id, chat.chatName, chat.profileImage,chat.isGroupChat)}>Message</button>
            </li>
          ))}
        </ul>
      ) }
    </div>
  );
};

export default FriendsList;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Cookies from "js-cookie";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {jwtDecode} from "jwt-decode";
// import { useSocket } from "../../connection";
// import axios from "axios";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
// import './friend.css';

// const FriendsList = () => {
//   const [chats, setChats] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [active, setActive] = useState(false); // For sliding effect
//   const [searchTerm, setSearchTerm] = useState('');
//   const socket = useSocket();
//   const navigate = useNavigate();

//   const getToken = () => {
//     const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
//     if (!token) {
//       console.error("No token found");
//     }
//     return token;
//   };

//   const getUserId = (token) => {
//     if (!token) return null;
//     try {
//       const decodedToken = jwtDecode(token);
//       return decodedToken.userId;
//     } catch (error) {
//       console.error("Invalid token:", error.message);
//       return null;
//     }
//   };

//   useEffect(() => {
//     setActive(true); // Trigger the sliding effect
    
//     const token = getToken();
//     const userId = getUserId(token);
//     const fetchChats = async () => {
//       if (!userId) return;
//       try {
//         const response = await axios.get(`http://localhost:3000/chats/AllUsergroups/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status !== 200) {
//           throw new Error('Failed to fetch chats');
//         }

//         const chatsData = response.data; // Adjust this line based on your actual response structure
//         console.log("Fetch All User Chats:", chatsData);
//         setChats(chatsData || []); // Ensure you are accessing the correct data structure
//       } catch (error) {
//         console.error('Fetch Chats Error:', error.message);
//       }
//     };

//     const fetchFriends = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3000/chats/AllUserfriends/${userId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.status !== 200) {
//           throw new Error('Failed to fetch friends');
//         }
      
//         const friendsData = response.data; // Adjust this line based on your actual response structure
//         console.log("Fetch All User Friends:", friendsData);
     
//         setFriends(friendsData.friends || []); // Ensure you are accessing the correct data structure
//       } catch (error) {
//         console.error('Fetch Friends Error:', error.message);
//       }
//     };

//     fetchChats();
//     fetchFriends();
//   }, []);

//   const handleMessageClick = async (friendId, userName, profileImage,status) => {
//     // socket.emit('join chat', friendId);
//     console.log("ghfty", status);
  
  
//     try {
//       const token = localStorage.getItem("token") || Cookies.get("jwt") || "";
//       const userId = getUserId(token);
  
//       if (!userId) {
//         console.error("User ID not found");
//         return;
//       }
  
//       const response = await axios.get(`http://localhost:3000/messages/${userId}/${friendId}`, {
//         params: { userId, chatId: friendId },
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });
//       const { conversation } = response.data;
//       console.log("jhjgghj", conversation);

//       if (response.status === 200) {
//         const { conversation } = response.data;
//         console.log(conversation);
  
//         if (conversation && conversation._id) {
//           const conversationName =
//             conversation.kind === "group"
//               ? conversation.groupName
//               : conversation.participants.find((p) => p.user._id !== userId)?.userName;
 
//           navigate(`/chat/${conversation._id}`, {
//             state: {
//               chatId: friendId,
//               conversation,
//               conversationName,
//               status:status
//             },
//           });
//         } else {
//           console.error("No conversation found or conversation ID not found");
//           console.log(friendId);
//           navigate(`/chat/${friendId}`, {
//             state: {
//               status:status,
//               chatId: friendId,
//               userName,
//               profileImage,
//               isGroupChat
//             },
//           });
//         }
//       } else {
//         console.error("Failed to check conversation");
//       }
//     } catch (error) {
//       console.error("Error in handleMessageClick:", error.message);
//     }
//   };

//   const filteredFriends = friends.filter((friend) =>
//     friend.userName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const filteredChats = chats.filter((chat) =>
//     chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className={`friends-container ${active ? 'active' : ''}`}>
//       <input
//         type="text"
//         placeholder="Search friends and groups"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="search-input"
//       />
//       {filteredFriends.length > 0 && (
//         <ul className="friends-list">
//           {filteredFriends.map((friend) => (
//             console.log(friend.status),
//             <li key={friend._id}>
              
//               <div className="friend-info">
//                 <div className="profile-image">
//                   <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//                 </div>
//                 <span>{friend.userName}</span>
//               </div>
              
//               <button className="message-button" onClick={() => handleMessageClick(friend._id, friend.userName,friend.profileImage,friend.status)}>Message</button>
//             </li>
//           ))}
//         </ul>
//       )}

//       {filteredChats.length > 0 && (
//         <ul className="chats-list">
//           {filteredChats.map((chat) => (
//             <li key={chat._id}>
//               <div className="chat-info">
//                 <div className="profile-image">
//                   <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//                 </div>
//                 <span>{chat.chatName}</span>
//               </div>
//               <button className="message-button" onClick={() => handleMessageClick(chat._id, chat.chatName, chat.profileImage,chat.status, chat.isGroupChat)}>Message</button>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default FriendsList;
