import mongoose from "mongoose";

interface Message {
    _id?: string,
    conversationId: mongoose.Schema.Types.ObjectId,
    senderId: string,
    message: string,
    creationTime: Date
}
export default Message