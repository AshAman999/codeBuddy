import React from "react";
import Avatar from "react-avatar";
import styles from "./Client.module.css";

// Function to shorten the name to a maximum of 4 characters
const shortenName = (name) => {
  if (name.length > 4) {
    return name.slice(0, 4) + "...";
  }
  return name;
};

// Component to display a single client with its name and avatar
export const Client = ({ userName }) => {
  const shortName = shortenName(userName);

  return (
    <div className={styles.client}>
      <Avatar name={userName} size={"25"} round={"20px"} />
      {/* <div className={styles.userName}>{shortName}</div> */}
    </div>
  );
};

export default Client;
