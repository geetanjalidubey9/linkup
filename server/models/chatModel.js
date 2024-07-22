const mongoose = require("mongoose");
const User = require("./user");

const chatModel = mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
  
    },
    chatName: { type: String, trim: true },
    chatPhoto: { type: String }, // Add this line for chat photo
    isGroupChat: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
groupProfilephoto: {
      data: Buffer,
      contentType: String
    },
    groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPrivate: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    isOfficial: { type: Boolean, default: false },
    isUnofficial: { type: Boolean, default: false },

    joinRequests: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        userName:{type:String},
        requestDate: { type: Date, default: Date.now },
        status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
      },
    ],
  },



  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatModel);

module.exports = Chat;
