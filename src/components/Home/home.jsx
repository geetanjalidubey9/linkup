import React, { useState, useEffect, useRef } from "react";
import "./home.css";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { useSocket } from "../../connection";
import axios from "axios";
const Home = () => {

  const [chats, setChats] = useState([]);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [friendUsers, setFriendUsers] = useState([]);
  const [memberGroups, setMemberGroups] = useState([]); 
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupPrivacy, setNewGroupPrivacy] = useState("public");
  const [newGroupType, setNewGroupType] = useState("official");
  const formOverlayRef = useRef(null);
  const socket = useSocket();
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
 
useEffect(() => {
    if (!socket) return;
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    fetchAllUsers();
    fetchAllGroups();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/auth/Allusers", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const usersData = await response.json();
      console.log("hjgff",usersData)
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Fetch All Users Error:", error.message);
    }
  };
console.log(users);
  const fetchAllGroups = async () => {
    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/chats/Allgroups", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const groupsData = await response.json();
      setGroups(groupsData);
      setFilteredGroups(groupsData);
    } catch (error) {
      console.error("Fetch All Groups Error:", error.message);
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    const query = event.target.value.toLowerCase();

    const filteredGroups = groups.filter((group) =>
      group.chatName.toLowerCase().includes(query)
    );
    setFilteredGroups(filteredGroups);

    const filteredUsers = users.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );
    setFilteredUsers(filteredUsers);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    handleSearchChange(event); // Use handleSearchChange to apply the search
  };

  const handleJoinGroup = async (groupId) => {
    try {
      const token = getToken();
      const { userId } = jwtDecode(token);

      const response = await fetch(`http://localhost:3000/chats/join-group`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId: groupId, userId }), // Send chatId and userId in request body
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to join group");
      }

      const { chat } = data;
      console.log(data);
      if (chat.isPublic) {
        console.log("Public group:", chat.isPublic);
        socket.emit("join req", { userId, chat });
        console.log(`Joined public group ${chat._id}`);
        setMemberGroups((prevMemberGroups) => [...prevMemberGroups, groupId]);
      } else if (chat.isPrivate) {
        console.log("Private group:", chat.isPrivate);
        socket.emit("join privatereq", { userId, chat });
        console.log(`Join request sent to private group ${chat._id}`);
        setMemberGroups((prevMemberGroups) => [...prevMemberGroups, groupId]);
      } else {
        console.log("Group is neither public nor private:", chat);
      }
    } catch (error) {
      console.error("Error joining group:", error.message);
    }
  };



  const handlesendRequest = async (friendId) => {
    try {
      const token = getToken();
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
  
      const response = await fetch(`http://localhost:3000/chats/send-request`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId, userId }), // Send friendId and userId in request body
      });
  
      const data = await response.json();
      console.log("Response Data:", data);
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to add friend");
      }
  
      console.log(data);
      socket.emit("send Request", { userId, friendId });
      setFriendUsers((prevFriendUsers) => [...prevFriendUsers, friendId]);
    } catch (error) {
      console.error("Error adding friend:", error.message);
    }
  };
  
  const handleCreateGroup = async (event) => {
    event.preventDefault();

    const exists = groups.some(
      (group) =>
        group.name && group.name.toLowerCase() === newGroupName.toLowerCase()
    );
    if (exists) {
      alert("Group name already exists. Please choose a different name.");
      return;
    }

    try {
      const token = getToken();
      const response = await fetch("http://localhost:3000/chats/create-group", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newGroupName,
          users: JSON.stringify(users.map((user) => user._id)),
          type: newGroupPrivacy === "public" ? "public" : "private",
          isOfficial: newGroupType === "official" ? true : false,
          createdBy: getUserId(),
        }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
alert("Successfully created the group");
      const newGroup = await response.json();
      setGroups([...groups, newGroup]);
      setShowCreateGroupForm(false);
      setNewGroupName("");
      setNewGroupPrivacy("public");
      setNewGroupType("official");
    
    } catch (error) {
      console.error("Error creating group:", error.message);
    }
  };

  
  const handleClickOutsideForm = (event) => {
    if (
      formOverlayRef.current &&
      !formOverlayRef.current.contains(event.target)
    ) {
      setShowCreateGroupForm(false);
    }
  };

  useEffect(() => {

    const fetchChats = async () => {
      const token = getToken();
      const userId = getUserId(token);
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
  
  const UsersList = ({ filteredUsers, currentUser, handlesendRequest }) => {
    // Create a map of pending requests for quick lookup
    const pendingRequestsMap = new Map();
    currentUser.friendRequests.forEach(request => {
      if (request.status === 'pending') {
        pendingRequestsMap.set(request.user, true);
      }
    });
  }  

  return (
    <div className="Home-container">
      <div className="create-group-button-container">
        <button
          onClick={() => setShowCreateGroupForm(true)}
          className="create-group-button"
        >
          Create Group
        </button>
      </div>
      {/* <form onSubmit={handleSearchSubmit}> */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search Groups or Users"
          className="search-bar"
        />
  {searchQuery && (
      <div className="groups-list">
      <ul>
        {filteredGroups.map((group) => (
          <li key={group._id}>
            <FaUserCircle className="avatar-icon" />
            <h4>{group.chatName}</h4>
            {chats.some(chat => chat._id === group._id) ? (
              <button className="join" disabled>
                Already a member
              </button>
            ) : (
              <button
                className="join"
                onClick={() => handleJoinGroup(group._id)}
              >
                Join Group
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
        
)}
{searchQuery && (
 <div className="users-list">
  <ul>
    {filteredUsers.map((user) => (
      <li key={user._id}>
        {user.avatar ? (
          <img
            src={`http://localhost:3000${user.avatar}`}
            alt="Avatar"
            className="avatar"
            crossOrigin="anonymous"
          />
        ) : (
          <FaUserCircle className="avatar-icon" />
        )}
        <h4>{user.userName}</h4>
        {user._id === userId ? (
          <button className="add-friend" disabled>
         you
          </button>
        ) : friends.some(friend => friend._id === user._id) ? (
          <button className="add-friend" disabled>
            Already a friend
          </button>
        ) : (
          <button className="add-friend" onClick={() => handlesendRequest(user._id)}>
            Add Friend
          </button>
        
        )}
      </li>
    ))}
  </ul>

</div> 
)}

      {showCreateGroupForm && (
        <div
          className="create-group-form-overlay"
          ref={formOverlayRef}
          onClick={handleClickOutsideForm}
        >
          <div className="create-group-form-container">
            <button
              className="close-button"
              onClick={() => setShowCreateGroupForm(false)}
            >
              ✕
            </button>
            <h2>Create Group</h2>
            <form className="create-group-form" onSubmit={handleCreateGroup}>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Group Name"
                className="create-group-input"
                required
              />
              <select
                value={newGroupPrivacy}
                onChange={(e) => setNewGroupPrivacy(e.target.value)}
                className="create-group-select"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
              <select
                value={newGroupType}
                onChange={(e) => setNewGroupType(e.target.value)}
                className="create-group-select"
              >
                <option value="official">Official</option>
                <option value="unofficial">Unofficial</option>
              </select>
              <button type="submit" className="create-group-submit">
                Create Group
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

