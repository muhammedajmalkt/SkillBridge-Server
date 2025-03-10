const users = new Map(); // store userId 

exports.notificationSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User Connected: ${socket.id}`);        

    // Store userId with socket.id
    socket.on("user_connected", (userId) => {
      users.set(userId, socket.id);
      console.log(`Mapped User ${userId} to Socket ${socket.id}`);
    //   console.log(users);
    });
    // Handle disconnection
    // socket.on("disconnect", () => {
    //   for (const [userId, socketId] of users) {
    //     if (socketId === socket.id) {
    //       users.delete(userId);
    //       console.log(`User ${userId} disconnected`);
    //       break;
    //     }
    //   }
    // });
  });
};

exports.users = users; // Export the users map
