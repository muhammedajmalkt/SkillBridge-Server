exports.videoCall = (io) => {
  const onlineUsers = new Map(); // Maps userId to socketId

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("user_connected", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("online_users", Array.from(onlineUsers.keys())); // Broadcast online users
      console.log(`User ${userId} mapped to socket ${socket.id}`);

      // Auto-start call when two users are online
      const users = Array.from(onlineUsers.keys());
      if (users.length === 2) {
        const [caller, receiver] = users;
        console.log(`Auto-starting call between ${caller} and ${receiver}`);
        io.to(onlineUsers.get(caller)).emit("start_call", { to: receiver });
        io.to(onlineUsers.get(receiver)).emit("start_call", { to: caller });
      }
    });

    socket.on("signal", (data) => {
      console.log(`Forwarding signal from ${socket.id} to ${data.to}:`, data);
      data.from = socket.id;
      const recipientSocketId = onlineUsers.get(data.to);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("signal", data);
      }
    });

    socket.on("disconnect", () => {
      const userId = [...onlineUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
      if (userId) {
        onlineUsers.delete(userId);
        io.emit("online_users", Array.from(onlineUsers.keys())); // Update online list
        console.log(`User ${userId} disconnected`);
      }
    });
  });
};
