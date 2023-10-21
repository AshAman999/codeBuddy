import React, { useEffect, useState } from "react";
import MonacoEditor from "react-monaco-editor";
import "monaco-editor/esm/vs/editor/editor.all.js"; // Import the Monaco Editor

const options = {
  autoIndent: "full",
  contextmenu: true,
  fontFamily: "monospace",
  fontSize: 13,
  lineHeight: 24,
  hideCursorInOverviewRuler: true,
  matchBrackets: "always",
  minimap: {
    enabled: true,
  },
  scrollbar: {
    horizontalSliderSize: 4,
    verticalSliderSize: 18,
  },
  selectOnLineNumbers: true,
  roundedSelection: false,
  readOnly: false,
  cursorStyle: "line",
  automaticLayout: true,
};

const Editor = ({ socketRef, roomId, onCodeChange }) => {
  const [code, setCode] = useState("");

  const handleEditorChange = (newValue) => {
    setCode(newValue);
    onCodeChange(newValue);

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

    return () => {
      socketRef.current.off("CodeChange");
    };
  }, [socketRef.current]);

  return (
    <div className="editor-container">
      <MonacoEditor
        options={options}
        width="100%" // Make the width 100% of the available space
        height="100vh" // Make the height 100% of the available space
        language="javascript"
        theme="vs-light"
        value={code}
        onChange={(e) => {
          handleEditorChange(e);
        }}
      />
    </div>
  );
};

export default Editor;
