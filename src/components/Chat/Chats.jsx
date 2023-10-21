import React from "react";
import styles from "./Chats.module.css";
import { IconButton, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";

function Chats({ socketRef, roomId, userName }) {
  // Dummy chat data
  const chatData = [
    {
      senderName: "me",
      message:
        "HelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHelloHello",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    {
      senderName: "me",
      message: "Hello!",
      timestamp: "10:00 AM",
    },
    {
      senderName: "other",
      message: "Hi there!",
      timestamp: "10:05 AM",
    },
    {
      senderName: "me",
      message: "How are you?",
      timestamp: "10:10 AM",
    },
    // Add more chat messages as needed
  ];

  return (
    <div className={styles.chatSection}>
      <div className={styles.headLine}>Chats</div>
      <div className={styles.chatArea}>
        {chatData.map((message, index) => (
          <div
            key={index}
            className={
              message.senderName === "me"
                ? styles.messageWrapperMe
                : styles.otherMessageOther
            }>
            <div
              className={
                message.senderName === "me"
                  ? styles.myMessage
                  : styles.otherMessage
              }>
              {message.message}
            </div>
            {/* <div className={styles.timestamp}>{message.timestamp}</div> */}
          </div>
        ))}
      </div>
      <div className={styles.sendArea}>
        <TextField
          size="small"
          label="Type a message"
          fullWidth
          variant="outlined"
        />
        <IconButton color="primary">
          <Send />
        </IconButton>
      </div>
    </div>
  );
}

export default Chats;
