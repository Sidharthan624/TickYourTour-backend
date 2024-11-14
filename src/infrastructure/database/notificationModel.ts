import mongoose, { Schema} from "mongoose";
import Notification from "../../domain/notification";

const notificationSchema: Schema<Notification> = new Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'provider',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package',
        required: true
    },
    notification: {
        type: String
    },
    creationTime: {
        type: Date,
        default: Date.now
    }
})
const NotificationModel = mongoose.model<Notification>('notification',notificationSchema)
export { NotificationModel}