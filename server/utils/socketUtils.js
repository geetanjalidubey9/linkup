const userSocketMap = {};

const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const registerSocket = (userId, socketId) => {
  userSocketMap[userId] = socketId;
};

const removeSocket = (userId) => {
  delete userSocketMap[userId];
};

module.exports = {
  getReceiverSocketId,
  registerSocket,
  removeSocket,
};
