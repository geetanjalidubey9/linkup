const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/user");

//@desc    Fetch user's groups (group chats where user is a member or admin)
//@route   GET /api/chat/user-groups
//@access  Protected

const fetchUserGroups = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Chat.find({
      isGroupChat: true,
      $or: [
        { users: userId },
        { groupAdmin: userId },
      ]
    })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .sort({ updatedAt: -1 })
    .select("chatName isPrivate isPublic");

    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Create or fetch One to One Chat
//@route   POST /api/chat/access
//@access  Protected
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId parameter is required" });
  }

  try {
    // Check if a chat exists between the authenticated user and the requested user
    let isChat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [req.user._id, userId] }
    })
    .populate("users", "-password")
    .populate("latestMessage");

    if (!isChat) {
      // Create a new chat if no existing chat is found
      const chatData = {
        chatName: "One to One Chat",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      isChat = await Chat.create(chatData);
    }

    // Populate the chat details with user information
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    res.status(200).json(isChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Fetch all chats for the authenticated user
//@route   GET /api/chat/all-chats
//@access  Protected
const fetchChats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({ users: userId })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Create New Group Chat
//@route   POST /api/chat/create-group
//@access  Protected
const createGroupChat = asyncHandler(async (req, res) => {
  const { name, type } = req.body;

  // Check if all required fields are provided
  if (!name || !type) {
    return res.status(400).json({ message: "Please provide name and type for the group chat" });
  }

  // Create the group chat data with only the authenticated user as the admin
  const chatData = {
    chatName: name,
    users: [req.user._id], // Start with only the admin in the group
    isGroupChat: true,
    groupAdmin: req.user._id, // The authenticated user will be the admin
    isPrivate: type === "private",
    isPublic: type === "public",
    isOfficial: type === "official",
    isUnofficial: type === "unofficial",
  };

  try {
    // Create the group chat in the database
    const groupChat = await Chat.create(chatData);

    // Populate the chat details with user information
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Rename Group
//@route   PUT /api/chat/rename-group
//@access  Protected
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Remove user from Group
//@route   PUT /api/chat/remove-user
//@access  Protected
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(removed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//@desc    Upload Group Profile Photo
//@route   PUT /api/chat/upload-group-profile-photo/:groupId
//@access  Protected
const uploadGroupProfilePhoto = asyncHandler(async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const avatar = req.file ? `/uploads/${req.file.filename}` : undefined;

    if (!avatar) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded or invalid file format',
      });
    }

    // Update group chat profile with the new avatar
    const updatedGroup = await Chat.findByIdAndUpdate(
      groupId,
      { $set: { avatar } },
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return res.status(404).json({ msg: 'Group chat not found' });
    }

    res.json({
      status: 'success',
      message: 'Group profile photo uploaded successfully',
      data: { avatar },
    });
  } catch (err) {
    console.error('Error in uploadGroupProfilePhoto:', err.message);
    res.status(500).send('Server Error');
  }

});




//@desc    Add user to Group
//@route   PUT /api/chat/add-user
//@access  Protected


const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    // Find the chat by ID
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // Check if the user is already a member of the chat
    const isMember = chat.users.includes(userId);
    if (isMember) {
      return res.status(400).json({ message: "User is already a member", chat });
    }

    // Check if the chat is private
    if (chat.isPrivate) {
      // If the requester is not the group admin, save the join request
      if (req.user.id !== chat.groupAdmin.toString()) {
        // Check if the user's join request is already pending
        const existingRequest = chat.joinRequests.find(request => request.user.toString() === userId);
        if (existingRequest) {
          return res.status(400).json({ message: "Join request already pending", chat });
        }
      
        const user = await User.findById(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }


        chat.joinRequests.push({ user: userId ,userName:user.userName});
        await chat.save();

        return res.json({ message: "Join request sent to group admin", chat });
      }

      // If the requester is the group admin, add the user directly
      chat.users.push(userId);
    } else {
      // If the chat is not private, add the user directly
      chat.users.push(userId);
    }

    // Save the updated chat
    const updatedChat = await chat.save();

    // Populate the necessary fields
    const populatedChat = await Chat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.json({ message: "User added to the group", chat: populatedChat });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


const getJoinRequests = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  
  try {
    // Find all private chats where the current user is the group admin
    const chats = await Chat.find({ isPrivate: true, groupAdmin: userId })
      .populate('groupAdmin', 'userName') // Populate groupAdmin to get admin details if needed
      .populate('joinRequests.user', 'userName'); // Populate user to get requester names

    // Filter out join requests initiated by the group admin (userId)
    const joinRequests = chats.reduce((acc, chat) => {
      const filteredRequests = chat.joinRequests.filter(request => String(request.user._id) !== userId);
      if (filteredRequests.length > 0) {
        // console.log(chat.chat._id)
        acc.push({
          chatId:chat._id,
          chatName: chat.chatName,
          requests: filteredRequests.map(request => ({
            requesterId: request.user._id,
            requesterName: request.user.userName
          }))
        });
      }
      return acc;
    }, []);

    console.log(joinRequests);

    res.json({ joinRequests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



//@desc    Fetch all group chats
//@route   GET /api/chat/all-groups
//@access  Protected
const fetchGroups = asyncHandler(async (req, res) => {
  try {
    const groups = await Chat.find({ isGroupChat: true })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .select("chatName isPrivate isPublic groupId");

    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const addToPrivateGroup = asyncHandler(async (req, res) => {
  const { chatId, userId ,requesterId} = req.body;
console.log(chatId)

  try {
    // Find the group by chatId

    const group = await Chat.findById(chatId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the requesting user is the group admin
    if (String(group.groupAdmin) !== String(req.user._id)) {
      return res.status(403).json({ message: "Only group admin can add users to the join request list" });
    }

    // Check if the user is already in the join request list
    if (group.users.includes(requesterId)) {
      return res.status(400).json({ message: "User is already the member" });
    }

    // Add the user ID to the joinReq array
    group.users.push(requesterId);

    // Remove the user from joinRequests if they exist
    group.joinRequests = group.joinRequests.filter(request => String(request.user) !== String(requesterId));

    await group.save();

    res.status(200).json({ message: "User added to the group", group });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const addfriend = asyncHandler(async (req, res) => {
  const { friendId, userId } = req.body;

  console.log("Friend ID:", friendId);
  console.log("User ID:", userId);

  try {
    // Prevent user from sending friend request to themselves
    if (friendId === userId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!user || !friend) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already a friend
    const isFriend = user.friends.includes(friendId);
    if (isFriend) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    // Check if the user's friend request is already pending
    const existingRequest = friend.friendRequests.find(request => request.user.toString() === userId);
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already pending" });
    }

    // Add friend request to the friend's friendRequests array
    friend.friendRequests.push({ user: userId, userName: user.userName });
    await friend.save();

    return res.json({ message: "Friend request sent", friend });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
const acceptRequest = asyncHandler(async (req, res) => {
  const { userId, requesterId } = req.body;
  console.log("User ID:", userId);
  console.log("Requester ID:", requesterId);

  try {
    // Find the user and requester by ID
    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User or requester not found" });
    }

    // Check if the user is already a friend
    const isFriend = user.friends.includes(requesterId);
    const isRequesterFriend = requester.friends.includes(userId);

    if (isFriend || isRequesterFriend) {
      return res.status(400).json({ message: "User is already a friend" });
    }

    // Add the requester ID to the user's friends list
    user.friends.push(requesterId);
    requester.friends.push(userId);

    // Remove the requester from friendRequests if they exist
    user.friendRequests = user.friendRequests.filter(request => String(request.user) === String(requesterId));

    // Save both the user and the requester
    await user.save();
    await requester.save();

    res.status(200).json({ message: "User added to friends list and friend request removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const getFriendRequests = asyncHandler(async (req, res) => {
  const { userId } = req.params;
console.log("dshgdtsy");
  try {
    const user = await User.findById(userId).populate('friendRequests.user', 'userName');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ friendRequests: user.friendRequests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



const fetchUserFriends = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Assuming userId is passed as a URL parameter

  try {
    // Find the user by ID and populate the friends field
    const user = await User.findById(userId).populate('friends', 'userName email profileImage status'); // Adjust the fields as necessary

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the list of friends
    res.status(200).json({ friends: user.friends });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


module.exports = {
  fetchUserGroups,
  accessChat,
  fetchChats,
  createGroupChat,  
  renameGroup,
  removeFromGroup,
  addToGroup,
  getJoinRequests,
  fetchGroups,
  addToPrivateGroup,
  addfriend,
  acceptRequest,
  getFriendRequests,
  fetchUserFriends,
 uploadGroupProfilePhoto

};





































