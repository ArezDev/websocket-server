import { createServer } from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";

const app = express();

// Enable CORS and JSON parsing
app.use(cors({ origin: "*" }));
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (you can restrict to specific domain)
    methods: ["GET", "POST"],
  },
});

// Log when server starts
console.log("🟡 Initializing WebSocket server...");

// Handle socket connections
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  // Emit a welcome message
  socket.emit("server-message", "Welcome");

  // Disconnect event
  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// REST endpoint to broadcast events
app.post("/broadcast", (req, res) => {
  const { event, payload } = req.body;

  if (!event || !payload) {
    console.warn("⚠️ Missing 'event' or 'payload' in /broadcast");
    return res.status(400).json({ error: "Missing 'event' or 'payload'" });
  }

  console.log(`📢 Broadcasting '${event}' to all clients. Payload:`, payload);
  io.emit(event, payload);

  return res.status(200).json({ success: true });
});

// Handle unknown routes
app.use("*", (_, res) => {
  res.status(404).json({ error: "Not found" });
});

// Start server
const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`✅ WebSocket server is listening on port ${PORT}`);
});