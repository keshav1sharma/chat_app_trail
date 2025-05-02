import mongoose from "mongoose";

export const connectDb = async ()=>{
    try
    {
       if (!process.env.MONGODB_URL) {
           throw new Error("MONGODB_URL is not defined in the environment variables");
       }
       const conn = await mongoose.connect(process.env.MONGODB_URL);
       console.log(`MONGODB connected :${conn.connection.host}`);
    }
    catch(e)
    {
        console.log(e);
    }
}