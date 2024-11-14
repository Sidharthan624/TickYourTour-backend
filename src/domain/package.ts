import mongoose from "mongoose";

interface Package {
    id?: mongoose.Schema.Types.ObjectId;
    providerId: mongoose.Schema.Types.ObjectId;
    title: string;  
    description: string; 
    destination: string;  
    category: string;
    price: number;  
    duration: number;  
    groupSize: number;  
    itinerary: string[];  
    photos: string[];  
    transportation: string; 
    accommodation: string;  
    status?: string;  
    rating?: number;  
    isBlocked?: boolean;  
    creationTime: Date;  
}

export default Package;
