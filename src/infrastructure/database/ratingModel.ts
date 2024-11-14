import mongoose, { Schema } from "mongoose";
import Rating from "../../domain/rating";
 const ratingSchema: Schema<Rating> = new Schema({
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'booking',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    reply: {
        type: String
    }
 })
 const RatingModel = mongoose.model<Rating>('rating',ratingSchema)
 export { RatingModel }