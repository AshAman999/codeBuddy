import React from "react";
import styles from "./LandingPage.module.css";
import { Button, TextField } from "@mui/material";
function LandingPage() {
  return (
    <div className={styles.landingPage}>
      <div className={styles.fillDetailBox}>
        <TextField className={styles.inputBox} placeholder="Enter Room Code" />
        <TextField className={styles.inputBox} placeholder="Enter Your Name" />
        <div className={styles.buttonsDiv}>
          <Button variant="contained">Submit</Button>
          <Button> Create A New room</Button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
