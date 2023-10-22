const express = require("express");
const app = express();
const {Server} = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);

const userSocketMap = {};

function getAllConnectedClient(roomId) {
  const connectedClients = Array.from(
      io.sockets.adapter.rooms.get(roomId) || [],
  );

  return (connectedClients.map((socketId) => ({
                                 socketId,
                                 userName : userSocketMap[socketId],
                               })) ||
          []);
}

io.on("connection", (socket) => {
  socket.on("join", ({roomId, userName}) => {
    userSocketMap[socket.id] = userName;
    socket.join(roomId);

    const clients = getAllConnectedClient(roomId);

    clients.forEach(({socketId}) => {
      io.to(socketId).emit("joined", {
        clients,
        userName,
        socketId : socket.id,
      });
    });

    socket.on("send-chat-message", (roomId, message, timeStamp) => {
      const messageData = {
        userName,
        message,
        timeStamp,
      };
      socket.in(roomId).emit("chat-message", messageData);
    });

    socket.on(
        "CodeChange",
        ({roomId, code}) => { socket.in(roomId).emit("CodeChange", {code}); });

    socket.on(
        "getInitialCode",
        ({socketId, code}) => { io.to(socketId).emit("CodeChange", {code}); });

    socket.on("disconnecting", () => {
      const rooms = [...socket.rooms ];

      rooms.forEach((roomId) => {
        const clients = getAllConnectedClient(roomId);
        socket.in(roomId).emit("user-disconnected", {
          clients,
          socketId : socket.id,
          userName : userSocketMap[socket.id],
        });
      });

      delete userSocketMap[socket.id];
      socket.leave();
    });
  });
});

const port = process.env.PORT || 5003;
server.listen(port,
              () => { console.log(`Server is running on port: ${port}`); });
