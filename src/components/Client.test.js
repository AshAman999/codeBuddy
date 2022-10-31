import { render, screen } from "@testing-library/react";
import { useRef } from "react";

import App from "../App";

import Client from "./Client";
import Editor from "./Editor";

describe("Client Details Rendering works as expected", () => {
  test("Client Name renders as expected", () => {
    const name = "Test";
    render(<Client userName={name} />);
    const client = screen.getByText(name);
    expect(client).toBeInTheDocument();
  });
});
