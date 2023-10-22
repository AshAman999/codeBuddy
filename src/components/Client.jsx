import React from "react";
import Avatar from "react-avatar";
import styles from "./Client.module.css";

export const Client = ({ userName }) => {
  return (
    <div className={styles.client} data-testid="client-component">
      <Avatar name={userName} size={"25"} round={"20px"} />
    </div>
  );
};

export default Client;
