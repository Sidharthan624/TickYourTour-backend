import mongoose from "mongoose";

interface Rating {
    id?: mongoose.Schema.Types.ObjectId,
    bookingId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    rating: number,
    review: string,
    reply: string
}
export default Rating