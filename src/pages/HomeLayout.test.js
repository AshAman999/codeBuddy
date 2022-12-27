import { render, screen } from "@testing-library/react";

import App from "../App";

describe("Test app renders properly", () => {
  test("render texts in document", () => {
    render(<App />);
    const inviteText = screen.getByText(/Don't have an invitation code?/i);
    expect(inviteText).toBeInTheDocument();

    const createRoomText = screen.getByText(/Create a new room/i);
    expect(createRoomText).toBeInTheDocument();

    const joinRoomButton = screen.getByRole("button", { name: /Join/i });
    expect(joinRoomButton).toBeInTheDocument();
  });

  test("footer rendered", () => {
    render(<App />);

    const amanName = screen.getByText(/Aman/);
    expect(amanName).toBeInTheDocument();
  });
});
