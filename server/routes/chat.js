const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const chatController = require('../controllers/chat');

// Routes related to chat functionality
router.route('/')
  .post(authController.protect, chatController.accessChat)
  .get(authController.protect, chatController.fetchChats);

router.route('/create-group')
  .post(authController.protect, chatController.createGroupChat);

router.route('/rename')
  .put(authController.protect, chatController.renameGroup);

router.route('/groupremove')
  .put(authController.protect, chatController.removeFromGroup);

router.route('/groupadd').put(authController.protect, chatController.addToPrivateGroup);

router.route('/Allgroups').get(authController.protect, chatController.fetchGroups);
  
router.route('/AllUsergroups/:userId').get(authController.protect, chatController.fetchUserGroups);
router.route('/join-group').put(authController.protect, chatController.addToGroup );
router.route('/send-request').put(authController.protect, chatController.addfriend );
router.route('/accept-request').put(authController.protect, chatController.acceptRequest );
router.route('/friend-request/:userId').get(authController.protect, chatController.getFriendRequests );
router.route('/AllUserfriends/:userId').get(authController.protect, chatController.fetchUserFriends);
router.get('/join-request/:userId',authController.protect, chatController.getJoinRequests);
  module.exports = router;
