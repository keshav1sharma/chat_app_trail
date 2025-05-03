import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId:{
            types:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        userId:{
            types:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        text:{
            type:String
        },
        image:{
            type:String
        }
    },
    {
        timestamps:true
    }
);

const message = mongoose.model("Message",messageSchema);
export default message;