import React from "react";
import { useLocation } from "react-router-dom";
import NamePrompt from "./NamePrompt";
import EditorHome from "../EditorHome";

function UserNameCheck() {
  const location = useLocation();
  const userName = location.state?.userName ? location.state.userName : "";
  return <>{userName === "" ? <NamePrompt /> : <EditorHome />}</>;
}

export default UserNameCheck;
