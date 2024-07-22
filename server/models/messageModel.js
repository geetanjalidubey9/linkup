// const mongoose = require('mongoose');

// const baseOptions = {
//   discriminatorKey: 'kind',
//   collection: 'messages'
// };

// const baseMessageSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',

//   },
//   senderName: {
//     type:String
//   },
//   receiverName: {
//     type:String

//   },
//   conversation: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Conversation',
//     required: true
//   },
  
//   content: {
//     type: String,
//     required: true
//   },
//   timestamp: {
//     type: Date,
//     default: Date.now
//   }
// }, baseOptions);

// const BaseMessage = mongoose.model('BaseMessage', baseMessageSchema);

// const ChatMessageSchema = new mongoose.Schema({
//   chatId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Chat',
//     required: true
//   },
  
//   conversation: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Conversation',
//     required: true
//   }
// });

// const UserMessageSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// });

// const ChatMessage = BaseMessage.discriminator('ChatMessage', ChatMessageSchema);
// const UserMessage = BaseMessage.discriminator('UserMessage', UserMessageSchema);

// module.exports = { BaseMessage, ChatMessage, UserMessage };

const mongoose = require('mongoose');

const baseOptions = {
  discriminatorKey: 'kind',
  collection: 'messages'
};

// Base schema for messages
const baseMessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderName: {
    type: String
  },
  receiverName: {
    type: String
  },
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, baseOptions);

// Model for base messages
const BaseMessage = mongoose.model('BaseMessage', baseMessageSchema);

// Schema for chat-specific messages
const ChatMessageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  }
});


// Schema for user-specific messages
const UserMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Discriminators for different types of messages
const ChatMessage = BaseMessage.discriminator('ChatMessage', ChatMessageSchema);
const UserMessage = BaseMessage.discriminator('UserMessage', UserMessageSchema);

module.exports = { BaseMessage, ChatMessage, UserMessage };
