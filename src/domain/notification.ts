import mongoose from "mongoose";
interface Notification {
    _id?: string,
    notification: string,
    creationTime: Date,
    providerId: mongoose.Schema.Types.ObjectId,
    packageId: mongoose.Schema.Types.ObjectId
}
export default Notification