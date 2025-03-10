const Chat = require("../Models/chatModel");

exports.chatSocket = (io) => {
  const onlineUser = new Map();

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("user_connected", (userId) => {
      onlineUser.set(userId, socket.id);
      io.emit("onlineUser", Array.from(onlineUser.keys()));
      console.log(`Mapped User ${userId} to Socket ${socket.id}`);
    });

    socket.on("sendMessage", async ({ senderId, receiverId, chat }) => {
      console.log(`📩 Message from ${senderId} to ${receiverId}: ${chat}`);

      const newMessage = new Chat({ senderId, receiverId, chat });
      await newMessage.save();

      const receiverSocketId = onlineUser.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", newMessage);
      } else {
        console.log(`Receiver ${receiverId} is offline.`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 User disconnected: ${socket.id}`);
      for (let [userId, socketId] of onlineUser.entries()) {
        if (socketId === socket.id) {
          onlineUser.delete(userId);
          break;
        }
      }
      io.emit("onlineUser", Array.from(onlineUser.keys()));
    });
  });
};
