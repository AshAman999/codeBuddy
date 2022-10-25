import React from "react";
import Avatar from "react-avatar";

// Component to display a single client with its name and avatar
export const Client = ({ userName }) => {
  return (
    <div className="client">
      <Avatar name={userName} size={"50"} round={"14px"} />
      <span className="userName">{userName}</span>
    </div>
  );
};

export default Client;
