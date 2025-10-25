import WebSocket, { Server } from "ws";

type BroadcastMsg = {
  type: "new-peer" | "peer-left";
  id: string;
};

export function createWebRTCServer(wss: Server<typeof WebSocket>) {
  const clients = new Map(); // id → ws

  function broadcast(msg: BroadcastMsg, exceptId: string | null = null) {
    for (const [id, client] of clients.entries()) {
      if (id !== exceptId && client.readyState === 1) {
        client.send(JSON.stringify(msg));
      }
    }
  }

  wss.on("connection", (ws) => {
    const id = Math.random().toString(36).substr(2, 9);
    clients.set(id, ws);

    ws.send(
      JSON.stringify({
        type: "init",
        id,
        others: [...clients.keys()].filter((k) => k !== id),
      })
    );

    broadcast({ type: "new-peer", id }, id);

    ws.on("message", (msg) => {
      let data;
      try {
        data = JSON.parse(msg as unknown as string);
      } catch {
        console.warn("Invalid JSON message:", msg);
        return;
      }

      if (data.target && clients.has(data.target)) {
        clients.get(data.target).send(JSON.stringify(data));
      }
    });

    ws.on("close", () => {
      clients.delete(id);
      broadcast({ type: "peer-left", id });
    });
  });

  console.log("WebRTC signaling logic initialized");
}

