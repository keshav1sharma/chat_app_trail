import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/message";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";
import path from "path";

import {app,server} from "./lib/socket";
import { connectDb } from "./lib/db";
dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure CORS based on environment
const allowedOrigins = process.env.NODE_ENV === "development" 
    ? ["http://localhost:5173"] 
    : [process.env.PRODUCTION_URL || "https://yourdomain.com"]; // Update this with your production URL

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

server.listen(PORT,()=>{
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    connectDb();
});