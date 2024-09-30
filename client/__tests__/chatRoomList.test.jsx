/*import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { ChatRoomList } from "../components/ChatRoomList";
import userEvent from "@testing-library/user-event";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ _id: "1", name: "Test Room" }]),
  }),
);

beforeEach(() => {
  fetch.mockClear();
});

it("displays rooms fetched from an API", async () => {
  render(<ChatRoomList onSelectRoom={() => {}} />);

  // Sjekk om rommet "Test Room" vises
  await screen.findByText("Test Room");
});

it("allows the user to create a new room", async () => {
  const user = userEvent.setup();
  render(<ChatRoomList onSelectRoom={() => {}} />);

  await user.type(screen.getByPlaceholderText("Nytt romnavn"), "Nytt Rom");
  fireEvent.click(screen.getByText("Opprett Rom"));

  expect(fetch).toHaveBeenCalledWith("/api/chatrooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Nytt Rom" }),
  });
}); */
