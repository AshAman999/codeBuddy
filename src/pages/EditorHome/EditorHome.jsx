import { saveAs } from "file-saver";
import { React, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import "./codeRun.css";

import Client from "../../components/Client";
import TextEditor from "../../components/Editor";
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
import Chats from "../../components/Chat/Chats";

// Component to display the main page of the application,
// which contains the code editor and the list of connected clients

const CodeEditorTheme = {
  light: {
    name: "Light",
    value: "light",
  },
  dark: {
    name: "Dark",
    value: "vs-dark",
  },
  // Add more themes here
};

const languages = {
  python: {
    name: "Python",
    extension: "py",
    value: "python",
  },
  javascript: {
    name: "JavaScript",
    extension: "js",
    value: "javascript",
  },
  go: {
    name: "Go",
    extension: "go",
    value: "go",
  },
  c: {
    name: "C",
    extension: "c",
    value: "c",
  },
  java: {
    name: "Java",
    extension: "java",
    value: "java",
  },
  cplusplus: {
    name: "C++",
    extension: "cpp",
    value: "cpp",
  },
  csharp: {
    name: "C#",
    extension: "cs",
    value: "csharp",
  },
};

export const EditorHome = () => {
  const [theme, setTheme] = useState(CodeEditorTheme.light.value); // State for the selected theme
  const [language, setLanguage] = useState(languages.javascript.value); // State for the selected language

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
              (client) => client.socketId !== socketId,
            );
          });
        },
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
    if (language !== languages.javascript.value) {
      setError(true);
      setResult(["Currently Only JavaScript is Supported"]);
      setPopUp(true);
    } else {
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
        const result = output.join("\n");
        console.log(result);
        setResult(result);
        setPopUp(true);
      } catch (error) {
        setError(true);
        console.error("An error occurred while running the code:", error);
        setResult([error.message]);
        setPopUp(true);
      }
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
    const fileExtension = language.extension || "txt"; // Use the selected language or default to "txt" if not found

    const filename = `codeBuddy_${roomId}.${fileExtension}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, filename);
  }

  if (!location.state) {
    <Navigate to="/" />;
  }

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
            size="small"
            variant="outlined"
            onClick={downloadCode}
            startIcon={<SaveAlt />}
          >
            Save Code
          </Button>
          <Select
            size="small"
            value={theme}
            onChange={handleThemeChange}
            defaultValue={theme}
          >
            {Object.keys(CodeEditorTheme).map((themeKey) => (
              <MenuItem key={themeKey} value={CodeEditorTheme[themeKey].value}>
                {CodeEditorTheme[themeKey].name}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={language}
            onChange={handleLanguageChange}
            defaultValue={language}
          >
            {Object.keys(languages).map((languageKey) => (
              <MenuItem key={languageKey} value={languages[languageKey].value}>
                {languages[languageKey].name}
              </MenuItem>
            ))}
          </Select>
          <Button variant="outlined" startIcon={<Chat />} size="small">
            Chat
          </Button>

          <Dialog
            open={false}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            // scroll="paper"
            PaperProps={{ sx: { mt: "50px", verticalAlign: "top" } }}
          >
            <DialogTitle>Chats</DialogTitle>
            <DialogContent
              sx={
                {
                  // height: "100vh",
                }
              }
            >
              {"1"}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary" size="small">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <Button variant="contained" onClick={runCode} size="small">
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
              <Button onClick={handleClose} color="primary" size="small">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </div>
      <div className={styles.EditorNChat}>
        <div className={styles.editorArea}>
          <TextEditor
            socketRef={socketRef}
            roomId={roomId}
            language={language}
            theme={theme}
            onCodeChange={(newCode) => {
              codeRef.current = newCode;
            }}
          />
        </div>

        <div className={styles.chatArea}>
          <Chats
            roomId={roomId}
            userName={location.state?.userName}
            socketRef={socketRef}
          />
        </div>
      </div>
    </div>
  );
};
export default EditorHome;
