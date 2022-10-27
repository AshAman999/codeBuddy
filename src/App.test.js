import {fireEvent, render, screen} from "@testing-library/react";

import App from "./App";

describe("Test app renders properly", () => {
  test("render texts in document", () => {
    render(<App />);
    const inviteText = screen.getByText(/Don't have an invitation code?/i);
    expect(inviteText).toBeInTheDocument();

    const createRoomText = screen.getByText(/Create a new room/i);
    expect(createRoomText).toBeInTheDocument();

    const joinRoomButton = screen.getByRole("button", {name : /Join/i});
    expect(joinRoomButton).toBeInTheDocument();
  });

  test("create a new room works", () => {
    render(<App />);

    const createRoomButton = screen.getByRole("button", {
      name : /Create a new room/,
    });
    expect(createRoomButton).toHaveClass("createNewBtn");

    fireEvent.click(createRoomButton);

    const roomCreatedText = screen.getByText(/Room created successfully/);
    expect(roomCreatedText).toBeInTheDocument();

    const roomId = screen.getByTestId("room-id");

    expect(roomId.value).toBeTruthy();
  });

  test("join room on empty value", () => {
    render(<App />);

    const joinRoomButton = screen.getByRole("button", {name : /Join/});
    fireEvent.click(joinRoomButton);

    const errorMessage = screen.getByText(/Please enter room id and user name/);
    expect(errorMessage).toBeInTheDocument();
  });

  test("footer rendered", () => {
    render(<App />);

    const amanName = screen.getByText(/Aman/);
    expect(amanName).toBeInTheDocument();
  });
});