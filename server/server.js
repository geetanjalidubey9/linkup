const app = require("./app");
const { Server } = require("socket.io");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Message = require("./models/messageModel");
const User = require("./models/user");
const Chat = require("./models/chatModel");
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT EXCEPTION! Shutting down ...");
  process.exit(1);
});

const DB_URI = process.env.DBURI.replace("<password>", process.env.DBPASSWORD);
mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.error("DB Connection error:", err);
    process.exit(1);
  });

// Create HTTP server with Express app
const server = http.createServer(app);
const users = {};
// Initialize Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with your client's URL
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  },
});

// Enable CORS for specific origin in Express app
app.use(
  cors({
    origin: "http://localhost:5173", // Replace with your client's URL
    methods: ["GET", "PATCH", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Socket.IO connection handling
io.on("connection", async (socket) => {
  console.log(`User connected: ${socket.id}`);

  const user_id = socket.handshake.query.user_id;
  console.log(user_id);
  if (user_id) {
    try {
      // Check if user is already connected
      const existingUser = await User.findById(user_id);
      if (existingUser) {
        existingUser.socket_id = socket.id;
        existingUser.status = "Online";
        await existingUser.save();
        users[user_id] = socket.id;
      } else {
        // Handle scenario where user_id doesn't exist
        console.log(`User ${user_id} not found in database.`);
      }
    } catch (e) {
      console.log("Error updating user status:", e);
    }
  }
  
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });
  // for public group
  socket.on("join req", async (message) => {
    console.log(message);
    const { userId, chat } = message;
    console.log("User ID:", userId);
    console.log("Is Group Public:", chat.isPublic);

    if (chat.isPublic) {
      console.log(chat.isPublic);
      const user = await User.findById(userId).select("socket_id");
      console.log(user);
      console.log(user.socket_id);
      io.to(user.socket_id).emit(
        "send Notification",
        `you have added in the group ${chat.chatName}`
      );
    }
  });
  // for private group
  socket.on("join privatereq", async (message) => {
    console.log(message);
    const { userId, chat } = message;
    console.log("User ID:", userId);
    console.log("Is private group:", chat.isPrivate);

    try {
      const requester = await User.findById(userId).select("userName");
      console.log("Requester User:", requester);

      if (chat.isPrivate) {
        console.log("Is private group:", chat.isPrivate);

        const admin = await User.findById(chat.groupAdmin).select("socket_id");

        if (admin && admin.socket_id) {
          console.log("Admin Socket ID:", admin.socket_id);

          io.to(admin.socket_id).emit("send Notdata", {
            userName: requester.userName,
            chatName: chat.chatName,
          });
          io.to(admin.socket_id).emit(
            "send priNotification",
            `${requester.userName} requests to join the group ${chat.chatName}`
          );
          io.to(requester.socket_id).emit(
            "send Notification",
            `you have added in the group ${chat.chatName}`
          );
        } else {
          console.log("Admin socket ID not found");
        }
      }
    } catch (error) {
      console.error("Error processing join request:", error);
    }
  });

  socket.on("send Request", async (message) => {
    console.log(message);
    const { friendId } = message;
    console.log("User ID:", friendId);

    const user = await User.findById(friendId).select("socket_id");
    console.log(user);
    console.log(user.socket_id);
    io.to(user.socket_id).emit(
      "send userNotdata",
      `you have added as friend of${user.userName}`
    );
    io.to(user.socket_id).emit(
      "send userNotification",
      `you have added as friend of ${user.userName}`
    );
  });

  socket.on("join room", async (data) => {
    console.log("chatId", data);
    const { chatId, sender } = data;

    try {
      let user = await User.findById(chatId).select("socket_id userName");

      if (user) {
        socket.join(chatId);
        io.to(user.socket_id).emit("typing", ` typing.........`);
        return;
      }

      // If not a User, check if it's a valid Chat ID
      let chat = await Chat.findById(chatId).populate(
        "users",
        "socket_id userName"
      );
      if (chat) {
        socket.join(chatId); // Join the room with chatId

        for (let participant of chat.users) {
          if (participant._id.toString() === sender) continue; // Skip sender
          if (participant.socket_id) {
            io.to(participant.socket_id).emit(

              "typing",
              `someone is typing..........`
            );
            console.log(`Typing status sent to ${participant.socket_id}.`);
          }
        }
      } else {
        console.log(`No User or Chat found with ID ${chatId}`);
      }
    } catch (error) {
      console.error("Error processing join room:", error);
    }
  });
  socket.on("typing", (room) => {
    console.log("typing");
    socket.to(room).emit("typing", socket.id);
  });

  socket.on("stop typing", (room) => {
    console.log("stop typing");
    socket.to(room).emit("stop typing", socket.id);
  });

  // for sending and reciving message
  socket.on("newMessage", async (incomingMessage) => {
    try {
      const { receiver, chatId, sender } = incomingMessage;
      if (receiver) {
        // Handling direct messages
        const user = await User.findById(receiver).select("socket_id");

        if (!user || !user.socket_id) {
          console.log(
            `User with ID ${receiver} not found or missing socket_id.`
          );
          return; // Exit early if user or socket_id not found
        }

        io.to(user.socket_id).emit("message received", incomingMessage);

        io.to(user.socket_id).emit(
          "message Notification",
          `${incomingMessage.content}`
        );

    
        console.log(
          `Direct message sent to user with socket_id ${user.socket_id}.`
        );


      } else if (chatId) {
        // Handling group chat messages
        let groupChat = await Chat.findById(chatId);

        if (!groupChat) {
          console.log(`Group chat with ID ${chatId} not found.`);
          return; // Exit early if group chat not found
        }

        for (let participant of groupChat.users) {
          if (participant.toString() === sender) continue; // Skip sender

          const user = await User.findById(participant).select("socket_id");

          if (user && user.socket_id) {
            io.to(user.socket_id).emit("message received", incomingMessage);
            io.to(user.socket_id).emit(
              "message Notification",
               `${incomingMessage.content}`,
           
            );

            console.log(
              `Group message sent to user with socket_id ${user.socket_id}.`
            );
          }
        }
      } else {
        console.log("Receiver or chatId not provided in incomingMessage.");
        return;
      }
    } catch (error) {
      console.error("Error sending message:", error.message);
    }
  });



  

  // Disconnect event
  socket.on("disconnect", async () => {
    console.log(`User disconnected: ${socket.id}`);

    if (user_id) {
      try {
        // Update user status in database to offline
        await User.findByIdAndUpdate(user_id, { status: "Offline" });
      } catch (error) {
        console.error(
          "Error updating user status on disconnect:",
          error.message
        );
      }
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
process.on("unhandledRejection", (err) => {
  console.error(err);
  console.log("UNHANDLED REJECTION! Shutting down ...");
  server.close(() => {
    process.exit(1);
  });
});
