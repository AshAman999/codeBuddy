import { render, screen } from "@testing-library/react";
import Client from "./Client";

describe("Client Component", () => {
  test("renders the Client component with an Avatar", () => {
    const userName = "TestUser";

    // Render the Client component
    render(<Client userName={userName} />);

    // Check if the Client component is rendered
    const clientComponent = screen.getByTestId("client-component");
    expect(clientComponent).toBeInTheDocument();
  });
});
