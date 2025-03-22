const Message = require("../Models/groupMessage");

exports.groupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Join a group room
    socket.on("joinGroup", async (groupId) => {
      try {
        socket.join(groupId);
        console.log(`User ${socket.id} joined group ${groupId}`);

        // Fetch previous messages
        const messages = await Message.find({ group: groupId })
          .populate("sender", "name email image")
          .populate("group","image title")
          .sort({ createdAt: 1 });

        socket.emit("previousMessages", messages);
      } catch (error) {
        console.error("Error joining group:", error);
      }
    });

    // Send Message
    socket.on("sendMessage", async (data) => {
      try {
        const { groupId, senderId, chat, media } = data;
        console.log("Received message:", data);

        if (!chat) {
          console.error("Error: Chat message is required.");
          return;
        }

        // Save the message
        const message = new Message({
          sender: senderId,
          group: groupId,
          chat, 
          media,
        });

        await message.save();       
       const populatedMessage = await Message.findById(message._id).populate("sender", "name email image")
       .populate("group","image title")
       


        // Emit to group
        io.to(groupId).emit("receiveMessage", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });
};
