const express = require('express');
const router = express.Router();

const authRoute = require('./auth');
const projectRoute = require('./project');


const messageRoute = require('./messages');
const chatRoute = require('./chat');

router.use('/auth', authRoute);
router.use('/project', projectRoute);


router.use('/messages', messageRoute);
router.use('/chats', chatRoute);

// Handle requests at the root path "/"
router.get('/', (req, res) => {
  res.send('Welcome to the main route');
});

module.exports = router;













