import { React, useEffect, useRef, useState } from "react";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import {
  useLocation,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import toast from "react-hot-toast";
// Component to display the main page of the application,
// which contains the code editor and the list of connected clients

export const EditorHome = () => {
  // Socket reference to be used in the Editor component
  const socketRef = useRef(null);
  // Reference to the code editor's value
  const codeRef = useRef(null);
  // Reference to the current webpage URL
  const location = useLocation();
  // Reference to the current room Joined
  const { roomId } = useParams();
  // Reference to the current connected clients
  const [connectedUsers, setConnectedUsers] = useState([]);
  // Reference to the current page Navigation

  const reactNavigator = useNavigate();
  useEffect(() => {
    // Initialize the socket connection
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => {
        // Show error toast if there is an error connecting to the server
        toast.error(err.message);
        // Navigate to the home page
        reactNavigator("/");
      });
      // If connection dies in the middle of the session
      socketRef.current.on("connect_failed", () => {
        //Show error toast
        toast.error("connection failed");
        // Navigate to the home page
        reactNavigator("/");
      });
      // If no troubles then join the room and brodcast the same message
      socketRef.current.emit("join", {
        roomId,
        userName: location.state?.userName,
      });

      // Listen for "joined" event from the server and update the connected users list
      socketRef.current.on("joined", ({ clients, userName, socketId }) => {
        if (userName !== location.state?.userName) {
          toast.success(`${userName} joined the room`);
        }
        setConnectedUsers(clients);
        // If the user connects for first time, sync the code from the session
        socketRef.current.emit("getInitialCode", {
          code: codeRef.current,
          socketId,
        });
      });
      // Listen for user-disconnected event and update the connected users list
      socketRef.current.on(
        "user-disconnected",
        ({ clients, socketId, userName }) => {
          toast.error(`${userName} left the room`);
          setConnectedUsers((prevConnectedUsers) => {
            return prevConnectedUsers.filter(
              (client) => client.socketId !== socketId
            );
          });
        }
      );
    };

    init();
    return () => {
      // Unsubscribe from all the socket events when the component unmounts
      socketRef.current.disconnect();
      socketRef.current.off("joined");
      socketRef.current.off("user-disconnected");
    };
  }, [location.state?.userName, reactNavigator, roomId]);

  // Copy roomId to clipboard
  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room Id copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy room id");
      console.log(err);
    }
  }

  // Leave the room and navigate to the home page
  function leaveRoom() {
    reactNavigator("/");
  }
  if (!location.state) {
    <Navigate to="/" />;
  }
  return (
    <div className="mainWrap">
      <div className="aside">
        <div className="asideInner">
          <div className="logoImage">
            {/* <img src="https://i.imgur.com/1Q9Q1Zy.png" alt="logo" /> */}
          </div>
          <h3>Connected</h3>
          <div className="clientList">
            {connectedUsers.map((client) => {
              return (
                <Client
                  key={client.socketId}
                  userName={client.userName}
                ></Client>
              );
            })}
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy Room Id
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            {" "}
            Leave{" "}
          </button>
        </div>
      </div>
      <div className="editorWrap">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};
export default EditorHome;
