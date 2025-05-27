// server.js
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow Vercel frontend
  },
});

io.on("connection", (socket) => {
  console.log("Client connected");

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });

  // contoh emit
  socket.emit("server-message", "Welcome");
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`WebSocket server listening on port ${PORT}`);
});
