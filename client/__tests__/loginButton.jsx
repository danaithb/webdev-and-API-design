/*import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { LoginButton } from "../components/LoginButton";

// Mock fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () =>
      Promise.resolve({
        authorization_endpoint: "https://accounts.google.com/o/oauth2/v2/auth",
      }),
  }),
);

beforeEach(() => {
  fetch.mockClear();
});

it("should create authorization URL and render login button", async () => {
  // Set environment variables
  process.env.GOOGLE_CLIENT_ID = "your-google-client-id";
  process.env.SERVER_ROOT_URI = "http://localhost:3000";

  render(<LoginButton />);

  await waitFor(() => expect(screen.getByRole("link")).toHaveAttribute("href"));

  const expectedUrl =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=your-google-client-id&redirect_uri=http://localhost:3000/login/callback&scope=openid profile email";
  expect(screen.getByRole("link")).toHaveAttribute("href", expectedUrl);

  expect(screen.getByRole("link")).toHaveTextContent("Logg inn med Google");
});*/
