import jwt from "jsonwebtoken";
import { Response } from "express";
import mongoose from "mongoose";

export const generateToken = (userId: mongoose.Types.ObjectId, res: Response) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: "7d",
    });
    res.cookie("jwt",token,{
        maxAge: 7*24*60*60*1000,
        httpOnly:true, //stops xss attacks 
        sameSite:"strict",
        secure:process.env.NODE_ENV !== "development"
    })
    return token;
}