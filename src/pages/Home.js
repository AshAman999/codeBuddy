import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Component to display the Home / Start Page of the application
export const HomePage = () => {
  // Reference to the current page Navigation
  const navigate = useNavigate();

  // Hook to store the current room ID
  const [roomId, setRoomId] = useState("");

  // Hook to store the current user name
  const [userName, setUserName] = useState("");

  // Function generates a random room ID
  const generateRoomCode = () => {
    const roomCode = Math.random().toString(36).substring(2, 9);
    return roomCode;
  };

  // Function to handle the Create New Room button click
  const createNewRoom = (e) => {
    e.preventDefault();
    const id = generateRoomCode();
    setRoomId(id);
    toast.success("Room created successfully");
  };

  // Function to handle the Join Room button click
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
            Don't have an invitation code? {/* instead of button user a tag */}
            <a className="createNewBtn" onClick={createNewRoom}>
              Create a new room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4 className="HomePageFooter">
          Built with ❣️ by <a href="https://github.com/ashaman999">Aman</a>
        </h4>
      </footer>
    </div>
  );
};
