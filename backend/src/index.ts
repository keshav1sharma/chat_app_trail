import express, { Request, Response } from "express";
import authRoutes from "./routes/auth";
import messageRoutes from "./routes/auth";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import cors from "cors";

import { connectDb } from "./lib/db";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

// Increase payload size limits
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/auth", messageRoutes);

app.listen(PORT,()=>{
    console.log("running on :"+PORT);
    connectDb();
});