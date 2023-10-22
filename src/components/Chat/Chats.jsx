import React, { useState, useEffect } from "react";
import styles from "./Chats.module.css";
import { IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

function Chats({ socketRef, roomId, userName }) {
  const [chatData, setChatData] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");

  // Function to handle new chat messages
  const handleChatMessage = (messageData) => {
    setChatData((prevChatData) => [...prevChatData, messageData]);
  };

  // Subscribe to chat messages when the component mounts
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("chat-message", handleChatMessage);
    }

    return () => {
      // Unsubscribe when the component unmounts
      socketRef.current.off("chat-message", handleChatMessage);
    };
  }, [socketRef.current]);

  // Function to send a chat message
  const sendChatMessage = () => {
    if (currentMessage.trim() === "") return;

    const messageData = {
      userName: userName,
      message: currentMessage,
      timeStamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setChatData([...chatData, messageData]);
    // Emit the message to the server
    socketRef.current.emit(
      "send-chat-message",
      roomId,
      currentMessage,
      userName,
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    );
    setCurrentMessage(""); // Clear the input field after sending
  };

  return (
    <div className={styles.chatSection}>
      <div className={styles.headLine}>Chats</div>
      <div className={styles.chatArea}>
        {chatData?.map((message, index) => (
          <div
            key={index}
            className={
              message.userName === userName
                ? styles.messageWrapperMe
                : styles.otherMessageOther
            }
          >
            <div
              className={
                message.userName === userName
                  ? styles.myMessage
                  : styles.otherMessage
              }
            >
              {message.message}
            </div>
            <div className={styles.timestamp}>{message.timeStamp}</div>
          </div>
        ))}
      </div>
      <div className={styles.sendArea}>
        <TextField
          size="small"
          label="Type a message"
          fullWidth
          variant="outlined"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendChatMessage();
            }
          }}
        />
        <IconButton aria-label="Send" color="primary" onClick={sendChatMessage}>
          <Send />
        </IconButton>
      </div>
    </div>
  );
}

export default Chats;
