import express, { Request, Response } from "express";
import  User  from "../models/userModel";
import bcrypt from "bcryptjs";
import {z} from "zod";
import { generateToken } from "../lib/utils";

const signupSchema = z.object({
    fullName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export const signup = async (req: Request, res: Response): Promise<void> => {
    const {fullName, email, password} = req.body;
    try {
        const parsedData = signupSchema.safeParse({fullName, email, password});
        if (!parsedData.success) {
            res.status(400).json({
                error: parsedData.error.errors.map((error) => error.message),
            });
            return;
        }
        const user = await User.findOne({email});
        if(user) {
            res.status(400).json({
                error: "User already exists",
            });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });
        if(newUser) {
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }
    }
    catch(error) {
        res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const {email,password} = req.body;
    try{
        const parsedData = loginSchema.safeParse({email, password});
        if (!parsedData.success) {
            res.status(400).json({
                error: parsedData.error.errors.map((error) => error.message),
            });
            return;
        }

        const user = await User.findOne({email});
        if(!user || !user.password)
        {
            res.status(400).json({
                message:"Invalid credentials"
            });
            return;
        }
        const correctPass = await bcrypt.compare(password,user.password);
        if(!correctPass)
        {
            res.status(400).json({
                message:"Invalid credentials"
            });
            return;
        }
        generateToken(user._id,res);
        res.status(200).json({
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic
        })
    }
    catch(error){
        console.log("err in login controller");
        res.status(500).json({
            message:"internal server error"
        });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({
            message:"logged out successfully"
        });
    }
    catch(error){
        console.log(error);
        res.status(500).json({
            message:"internal server error"
        });
    }
};