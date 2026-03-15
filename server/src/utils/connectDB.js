import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_DB_URI);
    } catch (error) {
        console.log("Error connecting to the database",error)
    }
}