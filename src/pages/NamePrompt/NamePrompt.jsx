import React from "react";
import styles from "./NamePrompt.module.css";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
function NamePrompt() {
  const navigate = useNavigate();
  return (
    <div className={styles.landingPage}>
      <div className={styles.fillDetailBox}>
        <TextField className={styles.inputBox} placeholder="Enter Your Name" />
        <div className={styles.buttonsDiv}>
          <Button variant="contained">Join</Button>
          <Button onClick={() => navigate("/x")}>
            Create Your own Room Instead
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NamePrompt;
