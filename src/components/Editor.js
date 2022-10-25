import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

// Component to display the actual Code-editor
const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  useEffect(() => {
    // CodeMirror instance given to id "realTimeEditor"
    async function init() {
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          // Configurations for the code editor
          mode: { name: "javascript", json: true },
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
        }
      );
      // Emit the changes to the server to be broadcasted to other users
      editorRef.current.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue") {
          socketRef.current.emit("CodeChange", {
            roomId,
            code,
          });
        }
      });
    }
    init();
  }, []);
  // Listen for code changes from other users and update the editor accordingly
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("CodeChange", ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }
    // Unsibscribe from the socket event [CodeChange] when the component unmounts
    return () => {
      socketRef.current.off("CodeChange");
    };
  }, [socketRef.current]);

  return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
