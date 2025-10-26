import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import cors from "cors";
import path from "path";

import userRoutes from "./routes/UserRoutes.js";
import roomRoutes from "./routes/RoomRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";

import { initializeDatabase } from "./database.js";
import { createWebRTCServer } from "./webrtc.js";
import { createChatConnection } from "./chat.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

initializeDatabase();
createWebRTCServer(wss);
createChatConnection(wss);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
  console.log(`WebSocket signaling server running on ws://localhost:${PORT}`);
});

