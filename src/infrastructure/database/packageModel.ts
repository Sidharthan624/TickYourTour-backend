import mongoose, { Schema, Model } from "mongoose";
import Package from "../../domain/package";


const packageSchema: Schema<Package> = new Schema({
  providerId: {
    type: Schema.Types.ObjectId,
    ref: "provider", 
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
  },
  groupSize: {
    type: Number,
    required: true,
  },
  itinerary: {
    type: [String],  
    required: true,
  },
  photos: {
    type: [String], 
  },
  transportation: {
    type: String,  
  },
  accommodation: {
    type: String,
  },
  status: {
    type: String,
    default: 'Verification required'
  },
  rating: {
    type: Number,
    default: 0,
  },
  isBlocked: {
    type: Boolean,
    default: false
},
  creationTime: {
    type: Date,
    default: Date.now,  
  },
});


const PackageModel: Model<Package> = mongoose.model<Package>("package", packageSchema);

export { PackageModel };
