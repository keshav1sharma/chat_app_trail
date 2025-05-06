// This file serves as a Vercel serverless function entry point
// Import required modules directly
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL || '');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Initialize Express
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true
  },
  path: "/socket.io/",
  transports: ['websocket', 'polling'],
});

// User socket map for real-time communication
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.auth.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
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

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// CORS setup
app.use(cors({
  origin: "*",
  credentials: true,
}));

// Import routes (dynamically to avoid import issues)
const setupRoutes = async () => {
  try {
    // Dynamic import for routes
    const authRoutes = (await import('../backend/dist/routes/auth')).default;
    const messageRoutes = (await import('../backend/dist/routes/message')).default;
    
    // Set up API routes
    app.use("/api/auth", authRoutes);
    app.use("/api/messages", messageRoutes);
  } catch (error) {
    console.error("Error setting up routes:", error);
  }
};

// Set up routes
setupRoutes();

// Connect to database
connectDb();

// For local development (with Vercel dev)
if (process.env.NODE_ENV !== 'production') {
  server.listen(5001, () => {
    console.log(`Development server running on port 5001`);
  });
}

// Export for Vercel serverless function
export default app;