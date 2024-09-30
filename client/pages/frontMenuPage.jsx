import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";
import { ChatRoomList } from "../components/chatRoomList";

export function HomePage() {
  const navigate = useNavigate();

  const handleSelectRoom = (roomId) => {
    navigate(`/chat/${roomId}`);
    console.log("Valgt chatrom ID:", roomId);
  };

  return (
    <div>
      <h1>Velkommen til ChatApp</h1>
      <ChatRoomList onSelectRoom={handleSelectRoom} />
      <button onClick={() => navigate("/profile")} className="profile-button">
        Min Profil
      </button>
      <button onClick={() => logout(navigate)} className="logout-button">
        Logg ut
      </button>
    </div>
  );
}
