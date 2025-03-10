exports.videoCall= (io)=>{
io.on("connection", (socket) => {
  console.log("New user connected:", socket.id);

  // Send the client's socket ID
  socket.emit("me", socket.id);

  // Handle call initiation
  socket.on("callUser", ({ userToCall, signalData, from }) => {
    io.to(userToCall).emit("callIncoming", { from, signal: signalData });
  });

  // Handle call answer
  socket.on("answerCall", ({ to, answer }) => {
    if (!answer) {
      console.error("Missing SDP answer");
      return;
    }
    io.to(to).emit("callAccepted", answer);
  });

  // Handle ICE candidate exchange
  socket.on("sendIceCandidate", ({ to, candidate }) => {
    io.to(to).emit("receiveIceCandidate", { candidate });
  });

  // Handle call ending
  socket.on("endCall", ({ to }) => {
    io.to(to).emit("callEnded");
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
}
