import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import "./Chatlist.css";
import { useSocket } from "../../connection";
import { faSmile, faUserCircle, faFile } from "@fortawesome/free-solid-svg-icons";

const ChatList = () => {

  const [isHidden, setIsHidden] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestNotification, setLatestNotification] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
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

  const token = getToken();
  const userId = getUserId(token);
  const handleClick = () => {
    setIsHidden(!isHidden);
  };


  const playNotificationSounds = () => {
    const audio = new Audio('/iphone_14_notification.mp3'); // Adjust the path based on your file location

    audio.play();
  };

  const addNotification = () => {
    // Increment notification count
    setNotificationCount(notificationCount+1);
  };

  useEffect(() => {

    socket.on("message Notification", (data) => {
      setLatestNotification(data);
     
        addNotification();

      playNotificationSounds();
      console.log(data);
    });

  // useEffect(() => {
  //   socket.on("message Notification", (data) => {
  //     setLatestNotification(data);
  //     setNotificationCount((prevCount) => prevCount + 1);
  //     addNotification()
  //     playNotificationSounds();
  //     console.log(data)
  //   });

    return () => {
      socket.off("message Notification");
    };
  }, [socket]);


useEffect(() => {
const fetchConversations = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/messages/conversations/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.status !== 200) {
          throw new Error("Failed to fetch conversations");
        }
        setConversations(response.data); // Store conversations in state
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    };

    if (token) {
      fetchConversations();
    }
  }, [token, userId]);

  useEffect(() => {
    const filterChats = () => {
      let filtered = conversations.filter((chat) => {
        const chatName =
          chat.kind === "group" ? chat.groupName : getConversationName(chat);
        return chatName.toLowerCase().includes(searchTerm.toLowerCase());
      });

      if (filter === "friends") {
        filtered = filtered.filter((chat) => chat.kind === "direct");
      } else if (filter === "groups") {
        filtered = filtered.filter((chat) => chat.kind === "group");
      }

      setFilteredChats(filtered);
    };

    filterChats();
  }, [conversations, searchTerm, filter]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const getConversationName = (conversation) => {
    if (conversation.kind === "group") {
      return conversation.groupName;
    }
    const participant = conversation.participants.find(
      (p) => p.user._id !== userId
    );
    return participant ? participant.user.userName : "Unknown";
  };
  
  useEffect(() => {
  const fetchMessages = async () => {
    if (!userId) return;

    try {
      const response = await axios.get(
        `http://localhost:3000/messages/${conversation._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
     
      // console.log("response",response.data);
      if (response.status === 200) {
        setMessages(response.data);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  fetchMessages();
}, []);
  useEffect(() => {
if (location.state?.activeConversation) {
      setActiveConversation(location.state.activeConversation);
    }
  }, [location.state])
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, avatar: file });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('photo', file);

      let token = localStorage.getItem('token');
      if (!token) {
        token = Cookies.get('jwt');
      }

      if (!token) {
        throw new Error('Token not found');
      }

      const response = await fetch('http://localhost:3000/auth/group/uploadphoto', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      console.log('Photo uploaded successfully');
      toast.success('Profile photo updated successfully!');
      // Optionally update the avatar URL in the state after successful upload
      const data = await response.json();
      setFormData((prevFormData) => ({ ...prevFormData, avatar: data.avatar }));
    } catch (error) {
      console.error('Upload Photo Error:', error.message);
      // Handle error (e.g., show error message to user)
    }
  };

  const handleConversationClick = (conversation) => {
    setActiveConversation(conversation._id);
    // console.log(conversation);
    const chatId = conversation.kind === "group"
    ? conversation.group  // Use group ID for group conversations
    : conversation.participants.find((p) => p.user._id !== userId)?.user._id;


    const conversationName =
      conversation.kind === "group"
        ? conversation.groupName
        : conversation.participants.find((p) => p.user._id !== userId)
            .userName;
         

       
    navigate(`/chat/${conversation._id}`, {
      state: {
      
        conversation:conversation,
        conversationName,
        chatId,
        activeConversation: conversation // Pass active conversation state 
      },
    });
  };


  return (
    <div>
    <div className="chatlist-container">
      <h2>Chats</h2>

      <div className="chatlist-wrapper">
        <div className="chatlist-header">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-bar"
          />
          <div className="filter-buttons">
            <button
              onClick={() => setFilter("all")}
              className={filter === "all" ? "active" : ""}
            >
              All
            </button>
            <button
              onClick={() => setFilter("friends")}
              className={filter === "friends" ? "active" : ""}
            >
              Friends
            </button>
            <button
              onClick={() => setFilter("groups")}
              className={filter === "groups" ? "active" : ""}
            >
              Groups
            </button>
          </div>
        </div>
      
        <div className="conversation-list">
     


          {filteredChats.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation-item ${
                conversation._id === activeConversation ? "active" : ""
              }`}
              onClick={() => handleConversationClick(conversation)}
            >

<div className="profile-image">
                  <label htmlFor="file-upload" className="file-upload-label">
                    <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                  
                    onChange={handleImageChange}
                    style={{ display: "none" }}

                  />
                </div>


              {/* <div className="profile-image">
             
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          
              </div> */}
              <div className="conversation-info">
                <h3 className="contact-name">
                  {getConversationName(conversation)}
                </h3>

<p className="last-message">
  {notificationCount > 1 ? (
    <span className="notification-count">
<span className="notification-badge">{notificationCount}</span>
      : {latestNotification}
    </span>
  ) : (
    conversation.lastMessage.length > 0 && (
      <>
        <span className="sender-name">{conversation.lastMessage[0]?.senderName}:{conversation.lastMessage[0]?.lastmsg}</span>
      
      </>
    )
  )}
</p>

                </div>
             
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default ChatList;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import Cookies from "js-cookie";
// import {jwtDecode} from "jwt-decode";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import axios from "axios";
// import "./Chatlist.css";
// import { useSocket } from "../../connection";
// import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

// const ChatList = () => {
//   const [isHidden, setIsHidden] = useState(false);
//   const [conversations, setConversations] = useState([]);
//   const [notificationCount, setNotificationCount] = useState(0);
//   const [activeConversation, setActiveConversation] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [latestNotification, setLatestNotification] = useState(null);
//   const [filter, setFilter] = useState("all");
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [filteredChats, setFilteredChats] = useState([]);
//   const socket = useSocket();
//   const navigate = useNavigate();
//   const location = useLocation();

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

//   const toggleDrawerfun = () => {
//     setIsDrawerOpen(!isDrawerOpen);
//   };

//   const token = getToken();
//   const userId = getUserId(token);
//   const handleClick = () => {
//     setIsHidden(!isHidden);
//   };

//   const playNotificationSounds = () => {
//     const audio = new Audio('/iphone_14_notification.mp3'); // Adjust the path based on your file location
//     audio.play();
//   };

//   const addNotification = () => {
//     setNotificationCount(notificationCount + 1);
//   };

//   useEffect(() => {
//     socket.on("message Notification", (data) => {
//       setLatestNotification(data);
//       addNotification();
//       playNotificationSounds();
//       console.log(data);
//     });

//     return () => {
//       socket.off("message Notification");
//     };
//   }, [socket]);

//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/messages/conversations/${userId}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         if (response.status !== 200) {
//           throw new Error("Failed to fetch conversations");
//         }
//         setConversations(response.data);
//       } catch (error) {
//         console.error("Error fetching conversations:", error);
//       }
//     };

//     if (token) {
//       fetchConversations();
//     }
//   }, [token, userId]);

//   useEffect(() => {
//     const filterChats = () => {
//       let filtered = conversations.filter((chat) => {
//         const chatName =
//           chat.kind === "group" ? chat.groupName : getConversationName(chat);
//         return chatName.toLowerCase().includes(searchTerm.toLowerCase());
//       });

//       if (filter === "friends") {
//         filtered = filtered.filter((chat) => chat.kind === "direct");
//       } else if (filter === "groups") {
//         filtered = filtered.filter((chat) => chat.kind === "group");
//       }

//       setFilteredChats(filtered);
//     };

//     filterChats();
//   }, [conversations, searchTerm, filter]);

//   const handleSearch = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const getConversationName = (conversation) => {
//     if (conversation.kind === "group") {
//       return conversation.groupName;
//     }
//     const participant = conversation.participants.find(
//       (p) => p.user._id !== userId
//     );
//     return participant ? participant.user.userName : "Unknown";
//   };

//   useEffect(() => {
//     const fetchMessages = async () => {
//       if (!userId) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:3000/messages/${activeConversation._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (response.status === 200) {
//           setMessages(response.data);
//         } else {
//           console.error("Failed to fetch messages");
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     if (activeConversation) {
//       fetchMessages();
//     }
//   }, [activeConversation, token, userId]);

//   useEffect(() => {
//     if (location.state?.activeConversation) {
//       setActiveConversation(location.state.activeConversation);
//     }
//   }, [location.state]);

//   const handleConversationClick = (conversation) => {
//     setActiveConversation(conversation);
//     const chatId =
//       conversation.kind === "group"
//         ? conversation.group // Use group ID for group conversations
//         : conversation.participants.find((p) => p.user._id !== userId)?.user
//             .userId;

//     const conversationName =
//       conversation.kind === "group"
//         ? conversation.groupName
//         : conversation.participants.find((p) => p.user._id !== userId)
//             .userName;

//     navigate(`/chat/${conversation._id}`, {
//       state: {
//         conversation: conversation,
//         conversationName,
//         chatId,
//         activeConversation: conversation,
//       },
//     });
//   };

//   return (
//     <div className="chatlist-container">
//       <button className="drawer-toggleleftbar" onClick={toggleDrawerfun}>
//         ☰
//       </button>
//       <h2>Chats</h2>
//       <div
//         className={`chatlist-wrapper ${isDrawerOpen ? "open" : ""}`}
//       >
//         <div className="chatlist-header">
//           <input
//             type="text"
//             placeholder="Search..."
//             value={searchTerm}
//             onChange={handleSearch}
//             className="search-bar"
//           />
//           <div className="filter-buttons">
//             <button
//               onClick={() => setFilter("all")}
//               className={filter === "all" ? "active" : ""}
//             >
//               All
//             </button>
//             <button
//               onClick={() => setFilter("friends")}
//               className={filter === "friends" ? "active" : ""}
//             >
//               Friends
//             </button>
//             <button
//               onClick={() => setFilter("groups")}
//               className={filter === "groups" ? "active" : ""}
//             >
//               Groups
//             </button>
//           </div>
//         </div>

//         <ul className="conversation-list">
//           {filteredChats.map((chat) => (
//             <li
//               key={chat._id}
//               className={`conversation-item ${
//                 activeConversation && activeConversation._id === chat._id
//                   ? "active"
//                   : ""
//               }`}
//               onClick={() => handleConversationClick(chat)}
//             >
//               <div className="conversation-info">
//                 {chat.kind === "group" ? (
//                   <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//                 ) : (
//                   <img
//                     src={`http://localhost:3000${chat.participants.find(
//                       (p) => p.user._id !== userId
//                     )?.user.profileImage}`}
//                     alt="Profile"
//                     className="profile-image"
//                   />
//                 )}
//                 <div>
//                   <div className="contact-name">
//                     {chat.kind === "group"
//                       ? chat.groupName
//                       : chat.participants.find((p) => p.user._id !== userId)
//                           ?.user.userName}
//                   </div>
//                   <div className="last-message">{chat.lastMessage}</div>
//                 </div>
//                 {chat.notificationCount > 0 && (
//                   <div className="notification-count">
//                     <span className="notification-badge">
//                       {chat.notificationCount}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default ChatList;
