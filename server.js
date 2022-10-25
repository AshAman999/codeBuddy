const express = require("express");
const app = express();
const { Server } = require("socket.io");
const http = require("http");
const server = http.createServer(app);
const io = new Server(server);

// Store the user name against the socket id
const userSocketMap = {};

// Return All the users connected to the room [roomId]
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

// When the first handshake is done
io.on("connection", (socket) => {
  socket.on("join", ({ roomId, userName }) => {
    // Store the user name against the socket id
    userSocketMap[socket.id] = userName;
    // Join the room
    socket.join(roomId);
    const clients = getAllConnectedClient(roomId);
    // Iterate over all the clients and emit the event to each client
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit("joined", {
        clients,
        userName,
        socketId: socket.id,
      });
    });
  });

  // When there is some code change in the editor
  socket.on("CodeChange", ({ roomId, code }) => {
    socket.in(roomId).emit("CodeChange", { code });
  });

  // Syncing the code when the user joins the room first time
  socket.on("getInitialCode", ({ socketId, code }) => {
    io.to(socketId).emit("CodeChange", { code });
  });

  // When the user leaves the room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    rooms.forEach((roomId) => {
      socket.in(roomId).emit("user-disconnected", {
        clients: getAllConnectedClient(roomId),
        socketId: socket.id,
        userName: userSocketMap[socket.id],
      });
    });
    // Remove the user from the userSocketMap
    delete userSocketMap[socket.id];
    socket.leave();
  });
});

const port = process.env.PORT || 5003;
server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
