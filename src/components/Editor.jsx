import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

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

const TextEditor = ({ socketRef, roomId, onCodeChange, theme, language }) => {
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
      <Editor
        options={options}
        width="100%" // Make the width 100% of the available space
        height="calc(100vh - 60px)" // Make the height 100% of the available space
        language={language}
        theme={theme}
        value={code}
        onChange={(e) => {
          handleEditorChange(e);
        }}
      />
    </div>
  );
};

export default TextEditor;
