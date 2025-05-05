import express, { Request, Response } from "express";
import User from "../models/userModel";
import Message from "../models/messageModel";
import cloudinary from "../lib/cloudinary";
import mongoose from "mongoose";

export const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch (error) {
        console.log("err in messages" + error);
        res.status(500).json({
            message: "internal server error"
        });
    }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        const messages = await Message.find({
            $or: [
                { senderId: new mongoose.Types.ObjectId(senderId), receiverId: new mongoose.Types.ObjectId(receiverId) },
                { senderId: new mongoose.Types.ObjectId(receiverId), receiverId: new mongoose.Types.ObjectId(senderId) }
            ]
        })
        .populate({
            path: 'senderId',
            select: '_id fullName profilePic',
            model: 'User'
        })
        .sort({ createdAt: 1 });

        console.log("Retrieved messages:", messages); // Debug log
        res.status(200).json(messages);
    }
    catch (error) {
        console.log("err in messages" + error);
        res.status(500).json({
            message: "internal server error"
        });
    }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            res.status(400).json({ message: "Invalid receiver ID" });
            return;
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create message with proper ObjectId types
        const message = await Message.create({
            senderId: new mongoose.Types.ObjectId(senderId),
            receiverId: new mongoose.Types.ObjectId(receiverId),
            text,
            image: imageUrl
        });

        // Fetch the complete message with populated sender
        const populatedMessage = await Message.findById(message._id)
            .populate({
                path: 'senderId',
                select: '_id fullName profilePic',
                model: 'User'
            });

        if (!populatedMessage) {
            res.status(500).json({ message: "Failed to create message" });
            return;
        }

        console.log("Created message:", populatedMessage); // Debug log
        res.status(201).json(populatedMessage);
    }
    catch (error) {
        console.log("err in messages" + error);
        res.status(500).json({
            message: "internal server error"
        });
    }
};