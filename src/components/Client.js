import React from "react";
import Avatar from "react-avatar";

// Component to display a single client with its name and avatar
export const Client = ({ userName }) => {
  return (
    <div className="client">
      <Avatar name={userName} size={"35"} round={"20px"} />
      <div className="userName">{userName}</div>
    </div>
  );
};

export default Client;
