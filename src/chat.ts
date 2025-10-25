import { Server } from "ws";
import { AppDataSource } from "./database";
import { Message } from "./entities/Message";
import { Room } from "./entities/Room";

export function createChatConnection(wss: Server) {
  const clients = new Map<string, { ws: WebSocket; roomId?: string }>();

  function broadcastToRoom(roomId: string, data: any) {
    for (const [id, client] of clients.entries()) {
      if (client.roomId === roomId && client.ws.readyState === client.ws.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    }
  }

  wss.on("connection", (ws) => {
    const id = Math.random().toString(36).slice(2);
    // @ts-ignore
    clients.set(id, { ws });

    ws.on("message", async (raw) => {
      let data;
      try {
        data = JSON.parse(raw.toString());
      } catch {
        console.warn("⚠️ Invalid JSON:", raw.toString());
        return;
      }

      const { type, payload } = data;

      if (type === "joinChat") {
        const roomId = payload.roomId;
        clients.get(id)!.roomId = roomId;
      }

      if (type === "sendMessage") {
        try {
          const messageRepository = AppDataSource.getRepository(Message);
          const roomRepository = AppDataSource.getRepository(Room);

          const { roomId, userId, by, content } = payload;

          if (!content?.trim()) {
            console.log("⚠️ Empty message, ignoring");
            return;
          }

          const room = await roomRepository.findOne({
            where: { id: roomId },
          });

          if (!room) {
            console.log("❌ Room not found:", roomId);
            return;
          }

          const message = messageRepository.create({
            room,
            userId,
            by,
            content: content.trim(),
          });

          await messageRepository.save(message);

          broadcastToRoom(roomId, { type: "newMessage", payload: message });
        } catch (err) {
          console.error("❌ Send message error:", err);
          ws.send(
            JSON.stringify({ type: "error", payload: { message: "Failed to send message" } })
          );
        }
      }
    });
  });
}

