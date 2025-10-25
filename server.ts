import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import cors from "cors";

import userRoutes from "./src/routes/UserRoutes.js";
import roomRoutes from "./src/routes/RoomRoutes.js";

import { initializeDatabase } from "./src/database.js";
import { createWebRTCServer } from "./src/webrtc.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes);

initializeDatabase();
createWebRTCServer(wss);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`HTTP server running on http://localhost:${PORT}`);
  console.log(`WebSocket signaling server running on ws://localhost:${PORT}`);
});

