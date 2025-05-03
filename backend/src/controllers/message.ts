import express, { Request, Response } from "express";
import  User  from "../models/userModel";
import Message from "../models/messageModel";
import cloudinary from "../lib/cloudinary";


export const getUsersForSidebar = async (req: Request, res: Response): Promise<void> => {
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("err in messages"+error);
        res.status(500).json({
            message:"internal server error"
        });
    }
};

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try{
        const {id:userToChatId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or:[
                {senderId:myId,userId:userToChatId},
                {senderId:userToChatId,userId:myId}
            ]
        })
        res.status(200).json(messages);
    }
    catch(error){
        console.log("err in messages"+error);
        res.status(500).json({
            message:"internal server error"
        });
    }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try{
        const {text,image} = req.body;
        const {id:receiverId} = req.params;
        const myId = req.user._id;

        let imageUrl;
        if(image)
        {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId:myId,
            userId:receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
        //realtime functionality goes here=> sockets
        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("err in messages"+error);
        res.status(500).json({
            message:"internal server error"
        });
    }
};