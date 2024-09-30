import request from "supertest";
import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());

const chatRoomApi = express.Router();
let mongoClient;
let chatRoomsCollection;

beforeAll(async () => {
  mongoClient = new MongoClient(process.env.MONGODB_URL);
  await mongoClient.connect().then(async () => {
    const mongoDb = mongoClient.db("chatApp");
    chatRoomsCollection = mongoDb.collection("chatRooms");
    console.log("Connected to MongoDB");
    app.use("/api/chatrooms", chatRoomApi);
  });
});

afterAll(() => {
  mongoClient.close();
});

chatRoomApi.post("/", async (req, res) => {
  const { name } = req.body;
  const newRoom = { name, createdAt: new Date() };
  try {
    await chatRoomsCollection.insertOne(newRoom);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(500).json({ message: "Failed to create chat room", error });
  }
});

describe("chat room api", () => {
  it("creates a new chat room", async () => {
    const chatRoom = { name: "Test Room" };
    await request(app).post("/api/chatrooms").send(chatRoom).expect(201);
  });

  it("fetches all chat rooms", async () => {
    const chatRoom = { name: "Another Test Room" };
    await request(app).post("/api/chatrooms").send(chatRoom).expect(201);
    const response = await request(app).get("/api/chatrooms").expect(200);
    expect(
      response.body.some((room) => room.name === chatRoom.name),
    ).toBeTruthy();
  });

  it("prevents creating a chat room with the same name", async () => {
    const chatRoom = { name: "Unique Room" };
    await request(app).post("/api/chatrooms").send(chatRoom).expect(201);
    await request(app).post("/api/chatrooms").send(chatRoom).expect(500); // Or another appropriate status code for duplicates
  });
});
