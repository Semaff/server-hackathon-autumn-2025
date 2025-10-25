import dotenv from "dotenv";
dotenv.config();

import { WebSocketServer } from "ws";

import { createWebRTCServer } from "./webrtc/index.js";

const wss = new WebSocketServer({ port: 8080 });
createWebRTCServer(wss);

console.log("WebSocket signaling server running on ws://localhost:8080");

