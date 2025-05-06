import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/message";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import { app, server } from "./lib/socket";
import { connectDb } from "./lib/db";
import { getDirname } from "./lib/path-helper";
dotenv.config();

const PORT = process.env.PORT || 5001;
const __dirname = getDirname();

// Increase payload size limits
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Configure CORS based on environment
const allowedOrigins =
  process.env.NODE_ENV === "development"
    ? ["http://localhost:5173"]
    : [process.env.PRODUCTION_URL || "https://yourdomain.com"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(cookieParser());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve static files and handle SPA routing in production
if (process.env.NODE_ENV === "production") {
  // Log the directory for debugging
  console.log("Static files directory:", path.join(__dirname, "frontend"));

  // Serve static files from frontend build directory
  app.use(express.static(path.join(__dirname, "frontend")));

  // Handle all other routes by serving the index.html (SPA routing)
  app.get("*", (req: Request, res: Response) => {
    if (req.url.startsWith("/api")) {
      return; // Skip API routes
    }
    res.sendFile(path.join(__dirname, "frontend/index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  connectDb();
});
