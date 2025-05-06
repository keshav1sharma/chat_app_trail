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
    : [process.env.PRODUCTION_URL || "*"];

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
  console.log("Running in production mode");

  // API routes are defined above, now handle frontend routes

  // Set the correct MIME type for JavaScript files
  app.get("*.js", (req, res, next) => {
    res.set("Content-Type", "application/javascript");
    next();
  });

  // Serve static files from frontend directory
  app.use(express.static(path.join(__dirname, "frontend")));

  // This is important - for any route not matched above, serve the index.html
  app.get("*", (req: Request, res: Response) => {
    // Don't handle API routes here (though they should be caught by the routes above)
    if (req.path.startsWith("/api")) {
      res.status(404).send("API route not found");
      return;
    }

    console.log("Serving index.html for path:", req.path);
    // Send the index.html file for client-side routing
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  connectDb();
});
