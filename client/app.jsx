import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./pages/loginPage";
import { ChatPage } from "./pages/chatPage";
import { LoginCallback } from "./components/loginCallback";
import { ProtectedRoute } from "./components/protectedRoute";
import { UserProfile } from "./pages/userPage";
import { HomePage } from "./pages/frontMenuPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login/callback" element={<LoginCallback />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={<Navigate to="/home" />} // eller en standard rom-ID
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
