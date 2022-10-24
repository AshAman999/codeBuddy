const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");

const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};
function getAllConnectedClient(roomId) {
  return (
    Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => {
      return {
        socketId: socketId,
        userName: userSocketMap[socketId],
      };
    }) || []
  );
}
// Array.from(io.sockets.adapter.rooms.get(roomId)) ||
//     [].map((socketId) => {
//       return {
//         socketId,
//         userName: userSocketMap[socketId],
//       };
//     })
//   );

io.on("connection", (socket) => {
  // console.log("a user connected ", socket.id);

  socket.on("join", ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClient(roomId);
    console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        userName,
        socketId: socket.id,
      });
      console.log("joined", clients, userName, socket.id);
    });

    // socket.to(roomId).emit("user-connected", userName);
  });

  //   socket.on("disconnect", () => {
  //     const userName = userSocketMap[socket.id];
  //     socket.broadcast.emit("user-disconnected", userName);
  //     delete userSocketMap[socket.id];
  //   });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
