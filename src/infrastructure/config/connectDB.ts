import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI as string
        await mongoose.connect(mongoUri)
        console.log('MongoDB connected');
        
    } catch (error) {
        console.log(error);
        
    }
}