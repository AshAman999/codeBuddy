import { io } from "socket.io-client";

// WebSocket connection of the client
export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: ["websocket"],
  };

  return io(process.env.REACT_APP_API_URL, options);
};
