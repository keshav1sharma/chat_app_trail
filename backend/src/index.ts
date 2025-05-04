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
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/auth",messageRoutes);

app.listen(PORT,()=>{
    console.log("running on :"+PORT);
    connectDb();
});