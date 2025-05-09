import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:5173"]
    : [process.env.PRODUCTION_URL || "*"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
  path: "/socket.io/",
  // This will help with Vercel's serverless functions
  transports: ["websocket", "polling"],
});

export function getReceiverSocketId(userId: string): string | null {
  return userSocketMap[userId] || null;
}

const userSocketMap: { [key: string]: string } = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.auth.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("userId", userId);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
