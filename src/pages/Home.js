import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const generateRoomCode = () => {
    const roomCode = Math.random().toString(36).substring(2, 7);
    return roomCode;
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = generateRoomCode();
    setRoomId(id);
    toast.success("Room created successfully");
    //Redirect to editor page
  };

  const joinRoom = (e) => {
    e.preventDefault();
    if (!roomId || !userName) {
      toast.error("Please enter room id and user name");
      return;
    } else {
      toast.success("Room joined successfully");

      navigate(`/editorHome/${roomId}`, {
        state: {
            userName,
        },
    }); 
    }
  };
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
          src="https://stackoverflow.design/assets/img/logos/so/logo-stackoverflow.png"
          alt="logo"
          className="homePageLogo"
        />
        <h4 className="mainLabel">Paste Invitation Code</h4>
        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="Invitation Code"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <input
            type="text"
            className="inputBox"
            placeholder="Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>
          <span className="createInfo">
            Don't have an invitation code?{" "}
            <a href="/editorHome" className="createNewBtn">
              {" "}
              onClick={createNewRoom}
              Create a new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          Built with ❣️ by <a href="https://github.com/ashaman999">Aman</a>
        </h4>
      </footer>
    </div>
  );
};
