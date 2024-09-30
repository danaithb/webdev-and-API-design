import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

dotenv.config();

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

const server = createServer(app);

// Opprett en WebSocket-server
const wsServer = new WebSocketServer({ noServer: true });
const sockets = [];

wsServer.on("connection", (socket) => {
  console.log("WebSocket-tilkobling etablert");
  sockets.push(socket);

  socket.on("message", (message) => {
    console.log("Melding mottatt:", message);
    const parsedMessage = JSON.parse(message);

    // Logikk for å håndtere innkommende meldinger og sende respons
    sockets.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(parsedMessage));
      }
    });
  });

  socket.on("close", () => {
    console.log("WebSocket-tilkobling lukket");
    // Fjern socket fra listen når den kobles fra
    const index = sockets.indexOf(socket);
    if (index > -1) {
      sockets.splice(index, 1);
    }
  });
});

// Koble WebSocket-serveren til HTTP-serveren
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

// Middleware for autentisering
async function authenticateToken(req, res, next) {
  const token = req.cookies.access_token;
  if (!token) {
    return res.status(401).send("Access token er påkrevd");
  }

  try {
    // Valider token og hent brukerinformasjon
    const userinfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    const userinfo = await userinfoResponse.json();

    if (!userinfoResponse.ok) {
      throw new Error(
        `Error fetching user info: ${userinfoResponse.statusText}`,
      );
    }

    req.user = {
      name: userinfo.name,
      _id: userinfo.sub, // Sub er vanligvis brukt som unik ID i Google's userinfo
    };
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(403).send("Invalid token");
  }
}

app.post("/api/login", async (req, res) => {
  const { code } = req.body;

  try {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const client_id = process.env.GOOGLE_CLIENT_ID;
    const client_secret = process.env.GOOGLE_CLIENT_SECRET;

    const redirect_uri = `${process.env.SERVER_ROOT_URI}/login/callback`;

    const response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code: code,
        client_id: client_id,
        client_secret: client_secret,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching token: ${response.statusText}`);
    }

    // Sett access_token i en httpOnly cookie
    res.cookie("access_token", data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Kun over HTTPS i produksjon
      sameSite: "lax", // Eller 'strict', avhengig av dine behov
    });

    // Send en respons tilbake til klienten
    res.json({ success: true, access_token: data.access_token });
  } catch (error) {
    console.error("Error during code exchange:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Opprett databaseklient og hent referanser til databaser og kolleksjoner
const client = new MongoClient(process.env.MONGODB_URL);
let messagesCollection;
let chatRoomsCollection;

// Koble til database
client
  .connect()
  .then(() => {
    const db = client.db("chatDatabase");
    messagesCollection = db.collection("messages");
    chatRoomsCollection = db.collection("chatRooms");

    // Beskyttede API-endepunkter
    app.post("/api/messages", authenticateToken, async (req, res) => {
      // Du må inkludere både tekst og rom-ID i kroppen av forespørselen
      const { text, roomId } = req.body;

      // Validerer at vi faktisk har tekst og rom-ID
      if (!text || !roomId) {
        return res.status(400).send("Tekst og rom-ID er nødvendig.");
      }

      // Oppretter et nytt meldingsobjekt, inkludert rom-ID
      const newMessage = {
        text: text,
        roomId: roomId, // Dette antar at rom-ID er en streng. Hvis det er et MongoDB ObjectId, må du kanskje konvertere det fra en streng.
        userName: req.user.name, // Brukerens navn hentet fra autentiseringsmiddleware
        createdAt: new Date(),
        userId: req.user._id, // Brukerens ID hentet fra autentiseringsmiddleware
      };

      try {
        await messagesCollection.insertOne(newMessage);
        res.status(201).json(newMessage);
      } catch (error) {
        console.error("Error inserting new message:", error);
        res.status(500).json({ message: "Error adding new message", error });
      }
    });

    app.get("/api/messages", authenticateToken, async (req, res) => {
      const { roomId } = req.query;
      // Logikk for å hente meldinger
      try {
        const messages = await messagesCollection
          .find({ roomId })
          .sort({ createdAt: 1 })
          .toArray();
        res.json(messages);
      } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
      }
    });

    app.post("/api/chatrooms", async (req, res) => {
      const { name } = req.body;

      const existingRoom = await chatRoomsCollection.findOne({ name: name });
      if (existingRoom) {
        return res
          .status(400)
          .send("Et rom med dette navnet eksisterer allerede.");
      }

      const newRoom = { name, createdAt: new Date() };
      await chatRoomsCollection.insertOne(newRoom);
      res.status(201).json(newRoom);
    });

    // Hent liste over chatrom
    app.get("/api/chatrooms", async (req, res) => {
      try {
        const rooms = await chatRoomsCollection.find().toArray();
        res.json(rooms);
      } catch (error) {
        res.status(500).json({ message: "Error fetching chat rooms", error });
      }
    });

    // Statisk filservering
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    app.use(express.static(path.join(__dirname, "../client/dist")));

    // Fallback for SPA-routing
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
      }
    });

    // Serveroppstart
    server.listen(process.env.PORT || 3000, () => {
      console.log(
        `Server kjører på http://localhost:${process.env.PORT || 3000}`,
      );
    });
  })
  .catch((error) => {
    console.error("Kunne ikke koble til MongoDB", error);
  });

export default app;
