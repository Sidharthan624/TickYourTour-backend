import mongoose from "mongoose";
interface Booking {
    id?: mongoose.Schema.Types.ObjectId,
    packageId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    bookingDate: Date,
    paymentSuccess: boolean,
    sessionId: string,
    isCancelled: boolean,
    payment_intent: string,
    totalPrice: number,
    rating: boolean
}
export default Booking