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

export const EditorHome = () => {
  const socketRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [connectedUsers, setConnectedUsers] = useState([]);
  const reactNavigator = useNavigate();
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      // handle errors
      socketRef.current.on("connect_error", (err) => {
        console.log(err.message);
        // also show a toast
        toast.error(err.message);
        // amd then redirect to home page
        reactNavigator("/");
      });
      // handle disconnect
      socketRef.current.on("connect_failed", () => {
        console.log("connection failed");
        // also show a toast
        toast.error("connection failed");
        // amd then redirect to home page
        reactNavigator("/");
      });
      socketRef.current.emit("join", {
        roomId,
        userName: location.state?.userName,
      });

      // Listen for joined event
      socketRef.current.on("joined", ({ clients, userName, socketId }) => {
        console.log(clients);
        if (userName !== location.state?.userName) {
          toast.success(`${userName} joined the room`);
        }
        setConnectedUsers(clients);
        console.log("joined", clients, userName, socketId);
      });
    };
    init();
  }, []);

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
          <button className="btn copyBtn">Copy Room Id</button>
          <button className="btn leaveBtn"> Leave </button>
        </div>
      </div>
      <div className="editorWrap">
        <Editor />
      </div>
    </div>
  );
};
export default EditorHome;
