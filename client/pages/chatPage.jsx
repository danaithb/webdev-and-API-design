import { logout } from "../utils/auth";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function ChatPage() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [ws, setWs] = useState(null);
  const { roomId } = useParams();

  useEffect(() => {
    const newWs = new WebSocket("ws://localhost:3000");

    newWs.onopen = () => {
      console.log("WebSocket-tilkobling åpnet.");
    };

    newWs.onmessage = (event) => {
      console.log("Melding mottatt:", event.data);
      const receivedMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
    };

    newWs.onerror = (error) => {
      console.error("WebSocket-feil:", error);
    };

    newWs.onclose = () => {
      console.log("WebSocket-tilkobling lukket.");
    };

    setWs(newWs);

    return () => {
      newWs.close();
    };
  }, []);

  // Function to retrieve existing messages from the server
  const fetchMessages = async () => {
    try {
      const response = await fetch(`/api/messages?roomId=${roomId}`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Feil ved henting av meldinger:", error);
    }
  };

  const navigateToHome = () => {
    navigate("/home"); // Navigates back to the main page
  };

  useEffect(() => {
    fetchMessages();
  }, [roomId]);

  // Auto-scroll to the bottom when messages are updated
  useEffect(() => {
    const container = document.querySelector(".chat-container");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim() !== "") {
      setIsSending(true);
      setError("");

      if (ws) {
        ws.send(JSON.stringify({ message: message }));
      }

      try {
        const response = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: message, roomId }),
        });

        if (response.ok) {
          const newMessage = await response.json();
          setMessages([...messages, newMessage]);
          setMessage("");
        } else {
          console.error("Server response error:", response);
          setError("Feil ved sending av melding.");
        }
      } catch (error) {
        console.error("Feil ved sending av melding:", error);
        setError("En feil oppstod ved sending av meldingen.");
      } finally {
        setIsSending(false);
      }
    }
  };

  return (
    <div>
      <h1>Chat Rom</h1>
      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>❣️{msg.userName}: </strong> {msg.text}
          </div>
        ))}
      </div>
      {isSending && <p>Sender melding...</p>}
      {error && <p className="error">{error}</p>}
      <input
        type="text"
        className="input-field"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Skriv en melding..."
      />
      <button onClick={sendMessage} className="send-button">
        Send
      </button>

      <div className="user-actions">
        <button onClick={navigateToHome} className="back-to-home-button">
          Tilbake til Hovedsiden
        </button>
        <button onClick={() => navigate("/profile")} className="profile-button">
          Min Profil
        </button>
        <button onClick={() => logout(navigate)} className="logout-button">
          Logg ut
        </button>
      </div>
    </div>
  );
}
