import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("access_token");
    if (accessToken) {
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  if (!user) {
    return <div>Laster brukerdata...</div>;
  }

  return (
    <div className="user-profile">
      <img src={user.picture} alt="Profilbilde" />
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>

      <button onClick={() => navigate("/chat")} className="back-to-chat-button">
        Tilbake til Chat Rom
      </button>
      <button onClick={() => logout(navigate)} className="logout-button">
        Logg ut
      </button>
    </div>
  );
}
