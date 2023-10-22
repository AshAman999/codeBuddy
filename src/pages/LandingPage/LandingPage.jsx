import React, { useState } from "react";
import styles from "./LandingPage.module.css";
import { Button, TextField, InputAdornment } from "@mui/material";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function LandingPage() {
  const navigate = useNavigate();

  // Hook to store the current room ID
  const [roomId, setRoomId] = useState("");

  // Hook to store the current user name
  const [userName, setUserName] = useState("");

  // Function generates a random room ID
  const generateRoomCode = () => {
    const roomCode = Math.random().toString(36).substring(2, 12);
    return roomCode;
  };

  // Function to handle the Create New Room button click
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = generateRoomCode();
    setRoomId(id);
    toast.success("Random room code generated successfully");
  };

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
        <img src="./logo.png" alt="logo"></img>
        <TextField
          className={styles.inputBox}
          placeholder="Enter Room Code"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button style={{ color: "primary" }} onClick={createNewRoom}>
                  <ShuffleIcon />
                </Button>
              </InputAdornment>
            ),
          }}
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <TextField
          className={styles.inputBox}
          placeholder="Enter Your Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <div className={styles.buttonsDiv}>
          <Button
            variant="contained"
            onClick={joinRoom}
            disabled={!roomId || !userName}
          >
            Submit
          </Button>
          <Button onClick={createNewRoom}> Create A New Room</Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
