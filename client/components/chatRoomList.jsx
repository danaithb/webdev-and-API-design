import React, { useState, useEffect } from "react";

export const ChatRoomList = ({ onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/chatrooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((error) => console.error("Error fetching chat rooms:", error));
  }, []);

  const handleCreateRoom = () => {
    if (!newRoomName) {
      setError("Romnavn kan ikke være tomt.");
      return;
    }

    // Checks if the room name exist
    if (
      rooms.some(
        (room) => room.name.toLowerCase() === newRoomName.toLowerCase(),
      )
    ) {
      setError("Chatrom med dette navnet finnes allerede!");
      return;
    }

    // Opprett et nytt rom - API-kall til backend
    fetch("/api/chatrooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newRoomName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((newRoom) => {
        setRooms([...rooms, newRoom]);
        setNewRoomName("");
        setError("");
      })
      .catch((error) => {
        console.error("Error creating new room:", error);
        setError("Feil av oppretting av rom..");
      });
  };

  return (
    <div className="chatroom-list">
      <h2 className="chatroom-title">Chatrom</h2>
      <div className="chatroom-buttons">
        {rooms.map((room) => (
          <button
            key={room._id}
            onClick={() => onSelectRoom(room._id)}
            className="chatroom-button"
          >
            {room.name}
          </button>
        ))}
      </div>
      <div className="chatroom-create">
        <input
          type="text"
          className="chatroom-input"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="Nytt romnavn"
        />
        <button onClick={handleCreateRoom} className="chatroom-create-button">
          Opprett Rom
        </button>
        {error && <p className="chatroom-error">{error}</p>}
      </div>
    </div>
  );
};
