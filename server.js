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
io.on("connection", (socket) => {

  socket.on("join", ({ roomId, userName }) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);
    const clients = getAllConnectedClient(roomId);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        userName,
        socketId: socket.id,
      });
    });

    // socket.to(roomId).emit("user-connected", userName);
  });


  socket.on('CodeChange', ({roomId, code}) => {
    socket.in(roomId).emit('CodeChange', {code});
  })

  socket.on('getInitialCode', ({socketId,code}) => {
   io.to(socketId).emit('CodeChange', {code});
  })
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("user-disconnected", {
        clients: getAllConnectedClient(roomId),
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
