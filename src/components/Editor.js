import React, { useEffect, useRef, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/editor/editor.all.js"; // Import the Monaco Editor

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState("");

  const handleEditorChange = (newValue) => {
    setCode(newValue); // Update the local state first
    onCodeChange(newValue);

    // Emit the changes to the server to be broadcasted to other users
    socketRef.current.emit("CodeChange", {
      roomId,
      code: newValue,
    });
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("CodeChange", ({ code: newCode }) => {
        if (newCode !== null) {
          setCode(newCode);
        }
      });
    }

    // Unsubscribe from the socket event [CodeChange] when the component unmounts
    return () => {
      socketRef.current.off("CodeChange");
    };
  }, [socketRef.current]);

  return (
    <MonacoEditor
      width="800" // You can adjust the width as needed
      height="400"
      language="javascript"
      theme="vs-light" // Change the theme as needed
      value={code} // Initial code value
      onChange={(e) => {
        handleEditorChange(e);
      }}
    />
  );
};

export default Editor;
