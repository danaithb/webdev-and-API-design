/*import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { WebSocket, Server } from "mock-socket";
import { ChatPage } from "../pages/ChatPage";

jest.mock("../utils/auth", () => ({
  logout: jest.fn(),
}));

describe("ChatPage", () => {
  let mockServer;
  const roomId = "123"; // Example room ID

  beforeEach(() => {
    // Set up mock WebSocket server
    mockServer = new Server("ws://localhost:3000");
    mockServer.on("connection", (socket) => {
      socket.on("message", (data) => {
        const message = JSON.parse(data);
        // Mock server response
        socket.send(JSON.stringify({ ...message, userName: "Test User" }));
      });
    });

    global.WebSocket = WebSocket;
  });

  afterEach(() => {
    mockServer.stop();
    jest.restoreAllMocks();
  });

  it("should allow users to type and send a message", async () => {
    render(
      <MemoryRouter initialEntries={[`/chat/${roomId}`]}>
        <Routes>
          <Route path="/chat/:roomId" element={<ChatPage />} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByPlaceholderText("Skriv en melding..."), {
      target: { value: "Hello World" },
    });

    fireEvent.click(screen.getByText("Send"));

    await waitFor(() => {
      expect(screen.getByText("❣️Test User: Hello World")).toBeInTheDocument();
    });
  });
});*/
