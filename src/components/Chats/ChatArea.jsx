// import React, { useState, useRef, useEffect } from "react";
// import { NavLink, useParams, useLocation } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSmile,
//   faUserCircle,
//   faFile,
  
// } from "@fortawesome/free-solid-svg-icons";
// import EmojiPicker from "emoji-picker-react";
// import axios from "axios";
// import Cookies from "js-cookie";
// import { jwtDecode } from "jwt-decode";
// import { useSocket } from "../../connection";
// import "./ChatArea.css";

// const ChatArea = () => {
//   const location = useLocation();
//   const {
//     userName,
//     profileImage,
//     chatName,
//     conversationName,
//     conversation,
//     chatId,
//   } = location.state || {};
//   const [message, setMessage] = useState("");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const messageAreaRef = useRef(null);
//   const socket = useSocket();
//   // console.log("kjhuyf",chatId);
//   // console.log("conversation", conversation);
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

//   const playNotificationSound = () => {
//     const audio = new Audio('/mixkit-message-pop-alert-2354.mp3'); // Adjust the path based on your file location

//     audio.play();
//   };
//   const addNotification = () => {
//     console.log(notificationCount)
// setNotificationCount(notificationCount + 1);

//   };
//   useEffect(() => {
//     socket.on("message received", (data) => {
//       console.log("Message received:", data);
  
//       if (data.sender._id !== getUserId()) {
//         setMessages((prevMessages) => [...prevMessages, data]);
//       }
//     });

//     return () => {
//       socket.off("message received");
//     };
//   }, []);

//   useEffect(() => {
//     const token = getToken();
//     const userId = getUserId(token);
//     const fetchMessages = async () => {
//       if (!userId) return;

//       try {
//         const response = await axios.get(
//           `http://localhost:3000/messages/${conversation._id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );
//         // console.log("response",response.data);
//         if (response.status === 200) {
//           setMessages(response.data);
//         } else {
//           console.error("Failed to fetch messages");
//         }
//       } catch (error) {
//         console.error("Error fetching messages:", error);
//       }
//     };

//     fetchMessages();
//   }, []);

//   const handleSendClick = async () => {
//     if (!message.trim()) return;
//     try {
//       const token = getToken();
//       const userId = getUserId();

//       // Example: Sending message to backend
//       const response = await axios.post(
//         `http://localhost:3000/messages/send-message/${chatId}`, // Correct URL
//         {
//           chatId: chatId,
//           userId: userId,
//           message: message,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       playNotificationSound();
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         {
//           ...response.data,
//           sender: { _id: userId }, // Ensure the sender ID matches the user ID
//         },
//       ]);
//       setMessage("");

//       socket.emit("newMessage", response.data);
//       // console.log("Message sent successfully", response.data);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };



//   return (
//     <div className="chat-area">
//       <div className="profile-heading">
//         <NavLink to="/profile" className="profile-link">
//           {profileImage ? (
//             <img
//               src={profileImage}
//               alt="Profile Icon"
//               className="profile-icon"
//             />
//           ) : (
//             <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
//           )}
//         </NavLink>
//         <span className="user-name">
//           {userName || chatName || conversationName}
//         </span>
//       </div>

//       <div className="message-section">
//         <div className="message-area" ref={messageAreaRef}>
//           {messages.map(
//             (msg, index) => (
//               // console.log(`Message ID: ${msg.sender._id}, User ID: ${userId}`),
            
//               (
//                 <div
//                   key={index}
//                   className={`message ${
//                     msg.sender._id !== userId ? "received" : "sent"
//                   }`}
//                 >
//                   <div className="message-sender">
//                     ~{msg.sender === getUserId() ? userName : msg.senderName}
//                   </div>

//                   <span>{msg.content}</span>
//                 </div>
//               )
//             )
//           )}
//         </div>

//         <div className="message-input">
//           <button
//             className="emoji-button"
//             onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//           >
//             <FontAwesomeIcon icon={faSmile} />
//           </button>
//           {showEmojiPicker && (
//             <EmojiPicker
//               onEmojiClick={(emoji) => {
//                 setMessage(message + emoji.emoji);
//                 setShowEmojiPicker(false);
//               }}
//             />
//           )}
//           <button
//             className="file-button"
//             onClick={() => document.getElementById("file-input").click()}
//           >
//             <FontAwesomeIcon icon={faFile} />
//           </button>
//           <input
//             type="file"
//             id="file-input"
//             style={{ display: "none" }}
//             onChange={(e) => setSelectedFile(e.target.files[0])}
//           />
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             placeholder="Type a message..."
//             rows={1}
//           />
//           <button className="send-button" onClick={handleSendClick}>
//             Send
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;




import React, { useState, useRef, useEffect } from "react";
import { NavLink, useParams, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faUserCircle,
  faFile,
  
} from "@fortawesome/free-solid-svg-icons";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "../../connection";
import "./ChatArea.css";

const ChatArea = () => {
  const location = useLocation();
  const {
    userName,
    profileImage,
    chatName,
    conversationName,
    conversation,
    chatId,
    status
  } = location.state || {};
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false); // State to track typing status
  const [typingStatus, setTypingStatus] = useState(""); // State to display typing status

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [messages, setMessages] = useState([]);
  const messageAreaRef = useRef(null);
  const socket = useSocket();
  console.log("kjhuyf",status);
  // console.log("conversation", conversation);
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
  const token = getToken();
  const userId = getUserId(token);

  const playNotificationSound = () => {
    const audio = new Audio('/mixkit-message-pop-alert-2354.mp3');

    audio.play();
  };

  useEffect(() => {
    socket.on("message received", (data) => {
      console.log("Message received:", data);
     
      if (data.sender._id !== getUserId()) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    socket.on("typing", (data) => {
      setTypingStatus(`${data}`);
    });

    socket.on("stop typing", () => {
      setTypingStatus("");
    });
    return () => {
      socket.off("typing");
      socket.off("stop typing");
      socket.off("message received");
    };
  }, []);
  useEffect(() => {
    if (message) {
      if (!typing) {
        setTyping(true);
        socket.emit("typing", chatId);
      }
      let lastTypingTime = new Date().getTime();
      let timerLength = 3000;
      setTimeout(() => {
        let timeNow = new Date().getTime();
        let timeDiff = timeNow - lastTypingTime;
        if (timeDiff >= timerLength && typing) {
          socket.emit("stop typing", chatId);
          setTyping(false);
        }
      }, timerLength);
    } else {
      if (typing) {
        socket.emit("stop typing", chatId);
        setTyping(false);
      }
    }
  }, [message]);

  socket.emit("join room", { chatId, userId });


  useEffect(() => {

   
    const token = getToken();
    const userId = getUserId(token);
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

  socket.emit("join room",{chatId,userId});
  const handleSendClick = async () => {
    if (!message.trim()) return;
    try {
      const token = getToken();
      const userId = getUserId();
     
      // Example: Sending message to backend
      const response = await axios.post(
        `http://localhost:3000/messages/send-message/${chatId}`, // Correct URL
        {
          chatId: chatId,
          userId: userId,
          message: message,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      
      // playNotificationSound();
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...response.data,
          sender: { _id: userId }, // Ensure the sender ID matches the user ID
        },
      ]);
      setMessage("");
      playNotificationSound();
      socket.emit("newMessage", response.data);
      // console.log("Message sent successfully", response.data);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };



  return (
    <div className="chat-area" >
      <div className="profile-heading">
        <NavLink to="/profile" className="profile-link">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile Icon"
              className="profile-icon"
            />
          ) : (
            <FontAwesomeIcon icon={faUserCircle} className="profile-icon" />
          )}
        </NavLink>
        <span className="user-name">
          {userName || chatName || conversationName}
          <p>
          {status}
         </p>
         {/* {typingStatus && (
            <div className="typing-status">
              <span>{typingStatus}</span>
            </div>
          )} */}
        </span>
        
      </div>
  
      <div className="message-section">
        <div className="message-area" ref={messageAreaRef}>
          {messages.map(
            (msg, index) => (
              // console.log(`Message ID: ${msg.sender._id}, User ID: ${userId}`),
            
              (
                <div
                  key={index}
                  className={`message ${
                    msg.sender._id !== userId ? "received" : "sent"
                  }`}
                >
                  <div className="message-sender">
                    ~{msg.sender === getUserId() ? userName : msg.senderName}
                  </div>

                  <span>{msg.content}</span>
                </div>
              )
            )
          )}
        </div>

        <div className="message-input">
          <button
            className="emoji-button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FontAwesomeIcon icon={faSmile} />
          </button>
          {showEmojiPicker && (
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setMessage(message + emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          )}
          <button
            className="file-button"
            onClick={() => document.getElementById("file-input").click()}
          >
            <FontAwesomeIcon icon={faFile} />
          </button>
          <input
            type="file"
            id="file-input"
            style={{ display: "none" }}
            onChange={(e) => setSelectedFile(e.target.files[0])}
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            rows={1}
          />
          <button className="send-button" onClick={handleSendClick}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
