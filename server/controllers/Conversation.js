const asyncHandler = require("express-async-handler");
const mongoose = require('mongoose');
const Chat = require("../models/chatModel");
const User = require("../models/user");
const Conversation = require("../models/Conversation");
const ChatMessage = require("../models/messageModel").ChatMessage;
const UserMessage = require("../models/messageModel").UserMessage;


const sendMessage = asyncHandler(async (req, res) => {
  const { chatId, userId, message} = req.body;
 

  try {
    let chat = await Chat.findById(chatId);

    if (!chat) {
      const user = await User.findById(chatId);
      if (!user) {
        return res.status(404).json({ message: "Chat or user not found" });
      } else {
        // Direct conversation logic
        const sender = await User.findById(userId);
        const receiver = await User.findById(chatId);

        if (!sender || !receiver) {
          return res.status(404).json({ message: "User not found" });
        }

            let conversation = await Conversation.findOne({
          $and: [
            { "participants.user": sender._id },
            { "participants.user": receiver._id },
          ],
          kind:'direct'
        });

        if (!conversation) {
          conversation = new Conversation({
            participants: [
              { user: sender._id, userName: sender.userName },
              { user: receiver._id, userName: receiver.userName },
            ],
          
            kind: 'direct'
          });
          

          await conversation.save();
        }

        const newMessage = new UserMessage({
          receiver: chatId,
          conversation: conversation._id,
          sender: userId,
          senderName:sender.userName,
          receiverName:receiver.userName,
          content: message,
          timestamp: new Date(),
          userId: userId, 
         
        });

        await newMessage.save();

        // Update last message in Conversation model
        await Conversation.findByIdAndUpdate(conversation._id, {
          $set: {
            lastMessage: {
              messageId: newMessage._id,
              senderName: sender.userName,
              lastmsg: message,
            },
          },
        });

      res.status(201).json(newMessage);
      }
    } else {
      // Group chat logic
      const userInChat = chat.users.some((user) => user.equals(userId));

      if (!userInChat) {
        return res
          .status(404)
          .json({ message: "User not found in the chat group" });
      }

      // Check if conversation already exists
      let conversation = await Conversation.findOne({ group: chatId });

      if (!conversation) {
        conversation = new Conversation({
          participants: chat.users.map((user) => ({
            user,
            userName:user.userName,
          })),
          kind: 'group',
          group: chatId,
          groupName:chat.chatName
        });

        await conversation.save();
      }
      // const sender = await User.findById(userId);
      const newMessage = new ChatMessage({
        chatId,
        senderName: (await User.findById(userId)).userName,
        sender: userId,
        content: message,
        timestamp: new Date(),
        conversation: conversation._id, // Ensure conversation is set here
      });

      await newMessage.save();

   
      for (let user of chat.users) {
        const sender = await User.findById(userId);
        await Conversation.findOneAndUpdate(
          { "participants.user": user, group: chatId },
          
          {
            
            $set: {
              lastMessage: {
                messageId: newMessage._id,
                senderName: (await User.findById(userId)).userName,
                lastmsg: message,
              },
            },
          },
          { new: true, upsert: true }
        );
      }

      // Response with new message
      res.status(201).json(newMessage);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    const conversations = await Conversation.find({
      "participants.user": userId,
    }).populate('participants.user', 'userName'); // Adjust the fields to populate as needed

    res.status(200).json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const getConversationMessages = asyncHandler(async (req, res) => {
  const conversationId = req.params.conversationId;

  try {
    // Fetch user messages
    const userMessages = await UserMessage.find({ conversation: conversationId }).populate('sender', 'userName').populate('receiver', 'userName');

    // Fetch chat messages
    const chatMessages = await ChatMessage.find({ conversation: conversationId }).populate('sender', 'userName').populate('chatId', 'chatName'); // Assuming you have a chatName field

    const messages = userMessages.concat(chatMessages).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
console.log(messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});




const checkConversation = asyncHandler(async (req, res) => {
  const { userId, chatId } = req.query;
  console.log(userId);
  console.log(chatId);
  try {
    // Ensure chatId and userId are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ message: "Invalid ObjectId" });
    }

    // Check if the chatId is a group and exists in any group conversation
    let conversation = await Conversation.findOne({ group: chatId });

    if (conversation) {
      console.log(conversation);
      return res.status(200).json({conversation});
    }

    // If not found, check for direct conversations
    conversation = await Conversation.findOne({
      participants: { $elemMatch: { user: userId } },
      participants: { $elemMatch: { user: chatId } },
      kind:'direct'
    });

    console.log("gfjkgf",conversation);
    if (conversation) {
      return res.status(200).json({ conversation });
    }

    // If no conversation is found
    res.status(200).json({ convoId: null });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = {
  sendMessage,
  getUserConversations,
  getConversationMessages,
  checkConversation
};












// const sendMessage = asyncHandler(async (req, res) => {
//   const { chatId, userId, message} = req.body;
 

//   try {
//     let chat = await Chat.findById(chatId);

//     if (!chat) {
//       const user = await User.findById(chatId);
//       if (!user) {
//         return res.status(404).json({ message: "Chat or user not found" });
//       } else {
//         // Direct conversation logic
//         const sender = await User.findById(userId);
//         const receiver = await User.findById(chatId);

//         if (!sender || !receiver) {
//           return res.status(404).json({ message: "User not found" });
//         }

//             let conversation = await Conversation.findOne({
//           $or: [
//             { "participants.user": sender._id },
//             { "participants.user": receiver._id },
//           ],
//         });

//         if (!conversation) {
//           conversation = new Conversation({
//             participants: [
//               { user: sender._id, userName: sender.userName },
//               { user: receiver._id, userName: receiver.userName },
//             ],
          
//             kind: 'direct'
//           });
          

//           await conversation.save();
//         }

//         const newMessage = new UserMessage({
//           receiver: chatId,
//           conversation: conversation._id,
//           sender: userId,
//           senderName:sender.userName,
//           receiverName:receiver.userName,
//           content: message,
//           timestamp: new Date(),
//           userId: userId, 
         
//         });

//         await newMessage.save();

//         // Update last message in Conversation model
//         await Conversation.findByIdAndUpdate(conversation._id, {
//           $set: {
//             lastMessage: {
//               messageId: newMessage._id,
//               senderName: sender.userName,
//               lastmsg: message,
//             },
//           },
//         });

//       res.status(201).json(newMessage);
//       }
//     } else {
//       // Group chat logic
//       const userInChat = chat.users.some((user) => user.equals(userId));

//       if (!userInChat) {
//         return res
//           .status(404)
//           .json({ message: "User not found in the chat group" });
//       }

//       // Check if conversation already exists
//       let conversation = await Conversation.findOne({ group: chatId });

//       if (!conversation) {
//         conversation = new Conversation({
//           participants: chat.users.map((user) => ({
//             user,
//             userName: user.userName,
//           })),
//           kind: 'group',
//           group: chatId,
//           groupName:chat.chatName
//         });

//         await conversation.save();
//       }

//       const newMessage = new ChatMessage({
//         chatId,
//         sender: userId,
//         content: message,
//         timestamp: new Date(),
//         conversation: conversation._id, // Ensure conversation is set here
//       });

//       await newMessage.save();

//       // Update last message for each participant in Conversation model
//       for (let user of chat.users) {
//         await Conversation.findOneAndUpdate(
//           { "participants.user": user, group: chatId },
//           {
//             $set: {
//               lastMessage: {
//                 messageId: newMessage._id,
//                 senderName: (await User.findById(userId)).userName,
//                 lastmsg: message,
//               },
//             },
//           },
//           { new: true, upsert: true }
//         );
//       }

//       // Response with new message
//       res.status(201).json(newMessage);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

