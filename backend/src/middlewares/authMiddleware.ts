import  Jwt  from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";

export const protectRoute = async (req:Request , res:Response,next:NextFunction): Promise<void>=>
{
    try {
        const token = req.cookies.jwt;
        if(!token)
        {
            res.status(401).json({
                message:"no jwt token provided"
            })
            return;
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || typeof decoded === "string") {//this is a type check by ts as it expects the type to be jwtpayload
            res.status(401).json({
                message: "jwt token is wrong"
            });
            return;
        }
        const user = await User.findById(decoded.id).select("-password");
        if(!user)
        {
            res.status(404).json({
                message: "user not found here "
            });
            return;
        }
        Object.assign(req, { user });
        next();
    } catch (error) {
        console.log("error in the authmiddleware:    "+error);
        res.status(500).json({
            message:"internal server error"
        })
    }
}