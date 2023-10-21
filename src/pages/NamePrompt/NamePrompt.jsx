import React, { useState } from "react";
import styles from "./NamePrompt.module.css";
import { Button, TextField } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom"; // Import useParams
import toast from "react-hot-toast";

function NamePrompt() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const roomId = searchParams.get("roomId");

  console.log("roomId", roomId);

  // Hook to store the current user name
  const [userName, setUserName] = useState("");

  // Function to handle the Join Room button click
  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !userName) {
      toast.error("Please enter room id and user name");
      return;
    } else {
      toast.success("Room joined successfully");
      navigate(`/editorHome?roomId=${roomId}`, {
        state: {
          userName,
        },
      });
    }
  };

  return (
    <div className={styles.landingPage}>
      <div className={styles.fillDetailBox}>
        <img src="./logo.png"></img>
        <TextField
          className={styles.inputBox}
          placeholder="Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <div className={styles.buttonsDiv}>
          <Button variant="contained" onClick={joinRoom}>
            Join
          </Button>
          <Button onClick={() => navigate("/x")}>
            Create Your own Room Instead
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NamePrompt;
