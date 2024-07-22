// const mongoose = require('mongoose');
// const chat=require("./chatModel")
// const User = require("./user");
// const ConversationSchema = new mongoose.Schema({

//   kind: {
//     type: String,
//     enum: ['direct', 'group'],
//     required: true
//   },
//   participants: [{
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User ID
//     userName: { type: String } // Name of the participant
//   }],


//     group:{type: mongoose.Schema.Types.ObjectId, ref: 'Chat'},
//     groupName:{type:String},

//   lastMessage: [{
//     messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Reference to the Message ID
//     senderName: { type: String }, // Name of the sender
//     lastmsg: { type: String } // Content of the last message
//   }],
//   createdAt: { type: Date, default: Date.now } // Timestamp of when the conversation was created
// });


// const Conversation= mongoose.model("Conversation",ConversationSchema );

// module.exports = Conversation;

const mongoose = require('mongoose');
const User = require("./user");
const Chat = require("./chatModel");

const ConversationSchema = new mongoose.Schema({
  kind: {
    type: String,
    enum: ['direct', 'group'],
    required: true
  },
  participants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User ID
    userName: { type: String } // Name of the participant
  }],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
  groupName: { type: String },
  lastMessage: [{
    messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }, // Reference to the Message ID
    senderName: { type: String }, // Name of the sender
    lastmsg: { type: String } // Content of the last message
  }],
  createdAt: { type: Date, default: Date.now } // Timestamp of when the conversation was created
});

const Conversation = mongoose.model("Conversation", ConversationSchema);

module.exports = Conversation;
