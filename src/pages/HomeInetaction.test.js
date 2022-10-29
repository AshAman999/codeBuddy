import {fireEvent, render, screen} from "@testing-library/react";

import App from "../App";

describe("Buttons works as expected", () => {
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
});
