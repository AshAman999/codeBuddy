import { saveAs } from "file-saver";
import { React, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaDownload } from "react-icons/fa";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./codeRun.css";

import Client from "../../components/Client";
import Editor from "../../components/Editor";
import { initSocket } from "../../socket";
import styles from "./EditorHome.module.css";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Select,
  MenuItem,
} from "@mui/material";
import { Chat, SaveAlt } from "@mui/icons-material";

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
  const searchParams = new URLSearchParams(location.search);
  // Get roomId from url search Param
  const roomId = searchParams.get("roomId");
  // Reference to the current connected clients
  const [connectedUsers, setConnectedUsers] = useState([]);

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
  const [result, setResult] = useState(null);
  const [error, setError] = useState(false);
  const [popUp, setPopUp] = useState(false);

  // TODO : Run the Other than JavaScript code in browser.
  function runCode() {
    try {
      let code = codeRef.current || "console.log('No code to run')";
      const codeWithReturn = `(function() { ${code} })();`;
      const originalConsoleLog = console.log; // Preserve the original console.log
      const output = [];

      // Override console.log to capture the output
      console.log = (value) => {
        output.push(value);
        originalConsoleLog(value);
      };

      eval(codeWithReturn); // Execute the code

      console.log = originalConsoleLog; // Restore the original console.log

      // Set the captured output in state for display
      setResult(output.join("\n"));
      console.log(result);
      setPopUp(true);
    } catch (error) {
      setError(true);
      console.error("An error occurred while running the code:", error);
      setResult(error.message);
      setPopUp(true);
    }
  }

  function handleClose() {
    setResult(null);
    setPopUp(false);
    setError(false);
  }

  // Download the code to user's local machine as js file
  function downloadCode() {
    const content = codeRef.current;
    const languageExtensions = {
      javascript: "js",
      python: "py",
      typescript: "ts",
      // Add more mappings if needed
    };

    const selectedLanguage = language || "txt";
    const fileExtension = languageExtensions[selectedLanguage] || "txt"; // Use the selected language or default to "txt" if not found

    const filename = `codeBuddy_${roomId}.${fileExtension}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }

  if (!location.state) {
    <Navigate to="/" />;
  }

  const [theme, setTheme] = useState("light"); // State for the selected theme
  const [language, setLanguage] = useState("javascript"); // State for the selected language

  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <div className={styles.mainPage}>
      <div className={styles.topBar}>
        <div className={styles.users}>
          {connectedUsers.map((client) => {
            return (
              <Client key={client.socketId} userName={client.userName}></Client>
            );
          })}
        </div>

        <div className={styles.menus}>
          <Button
            variant="outlined"
            onClick={downloadCode}
            startIcon={<SaveAlt />}>
            Save Code
          </Button>
          <Select
            sx={{ height: "35px" }}
            value={theme}
            onChange={handleThemeChange}
            defaultValue={theme}>
            <MenuItem value="light">Light Theme</MenuItem>
            <MenuItem value="dark">Dark Theme</MenuItem>
          </Select>

          <Select
            sx={{ height: "35px" }}
            value={language}
            onChange={handleLanguageChange}
            defaultValue={language}>
            <MenuItem value="javascript">JavaScript</MenuItem>
            <MenuItem value="python">Python</MenuItem>
            <MenuItem value="typescript">TypeScript</MenuItem>
          </Select>
          <Button variant="outlined" startIcon={<Chat />}>
            Chat
          </Button>

          <Button variant="contained" onClick={runCode}>
            Run
          </Button>

          <Dialog open={popUp} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle color={error ? "red" : "primary"}>
              {error ? "Some error Occured" : "Run Sucessfully"}
            </DialogTitle>
            <DialogContent>
              <p>{result}</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <Editor
        socketRef={socketRef}
        roomId={roomId}
        onCodeChange={(newCode) => {
          codeRef.current = newCode;
        }}
      />
    </div>
  );
};
export default EditorHome;
