const express = require("express");
const authController = require('../controllers/auth');
const ConversationController=require("../controllers/Conversation");


const router = express.Router();

// router.route("/:chatId").get(authController.protect, allMessages);
router.route("/send-message/:chatId").post(authController.protect,ConversationController.sendMessage);
router.route("/conversations/:userId").get(authController.protect,ConversationController. getUserConversations);
router.route("/:userId/:friendId").get(authController.protect,ConversationController.checkConversation );
router.route("/:conversationId").get(authController.protect,ConversationController.getConversationMessages);
module.exports = router;
