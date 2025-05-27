import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow Vercel frontend
  },
});

// Socket.io handler
io.on("connection", (socket) => {
  console.log("Client connected");

  socket.emit("server-message", "Welcome");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// REST endpoint to broadcast event from external (e.g., Vercel)
app.post("/broadcast", (req, res) => {
  const { event, payload } = req.body;

  if (!event || !payload) {
    return res.status(400).json({ error: "Missing 'event' or 'payload'" });
  }

  io.emit(event, payload); // Broadcast ke semua client
  console.log(`Broadcasted event '${event}' with payload:`, payload);
  res.status(200).json({ success: true });
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`✅ WebSocket server listening on port ${PORT}`);
});
