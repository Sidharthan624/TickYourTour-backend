import mongoose, { Schema} from "mongoose";
import Booking from "../../domain/booking";

const bookingSchema: Schema<Booking> = new Schema({
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    paymentSuccess: {
        type: Boolean,
        default: false
    },
    sessionId: {
        type: String
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    payment_intent: {
        type: String
    },
    totalPrice: {
        type: Number
    },
    rating: {
        type: Boolean,
        default: false
    }
})
const BookingModel = mongoose.model<Booking>('booking',bookingSchema)
export { BookingModel}