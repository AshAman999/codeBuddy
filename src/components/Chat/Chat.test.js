import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import Chats from "./Chats";

// Mock the socketRef for testing
const socketRefMock = {
  current: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
};

describe("Chats Component", () => {
  it("renders the component properly", () => {
    render(<Chats socketRef={socketRefMock} roomId="123" userName="User" />);

    // Check if the "Chats" header is displayed
    const chatsHeader = screen.getByText("Chats");
    expect(chatsHeader).toBeInTheDocument();

    // Check if the input field for typing a message is displayed
    const inputField = screen.getByLabelText("Type a message");
    expect(inputField).toBeInTheDocument();

    // Check if the send button (IconButton) is displayed
    const sendButton = screen.getByRole("button", { name: "Send" });
    expect(sendButton).toBeInTheDocument();
  });

  it("handles sending a chat message", () => {
    render(<Chats socketRef={socketRefMock} roomId="123" userName="User" />);

    // Get the input field and send button (IconButton)
    const inputField = screen.getByLabelText("Type a message");
    const sendButton = screen.getByLabelText("Send");

    // Type a message in the input field
    fireEvent.change(inputField, { target: { value: "Hello, Chat!" } });

    // Click the send button (IconButton)
    fireEvent.click(sendButton);

    // Check if the input field is cleared after sending the message
    expect(inputField).toHaveValue("");

    // Check if the message is sent to the server
    expect(socketRefMock.current.emit).toHaveBeenCalledWith(
      "send-chat-message",
      "123",
      "Hello, Chat!",
      expect.any(String), // Timestamp
    );
  });
});
