import Message from "../../domain/message";
import { messageModel } from "../database/messageModel";
import { conversationModel } from '../database/conversationModel'
import IMessageRepository from "../../useCase/interfaces/IMessageRepository";

class messageRepository implements IMessageRepository {
    async getMessages(conversationId: string): Promise<any> {
        try {
            const messages = await messageModel.find({ conversationId: conversationId})
            if(messages) {
                
                return messages
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async addMessage(data: Message): Promise<any> {
        try {
            const message = {
                message: data.message,
                conversationId: data.conversationId,
                senderId: data.senderId
            }
            const newMessage = new messageModel(message)
            await newMessage.save()
            const conversation = await conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now()})
            return newMessage
        } catch (error) {
            console.error(error);
            
        }
    }
    async addImageMessage(conversationId: string, providerId: string, image: string): Promise<any> {
        try {
            const data = {
                conversationId: conversationId,
                providerId: providerId,
                message: image
            }
            const newMessage = new messageModel(data)
            await newMessage.save()
            const conversation = await conversationModel.updateOne({ _id: data.conversationId}, { updationTime: Date.now()})
            return newMessage
        } catch (error) {
            console.error(error);
            
        }
    }
    async addVideoMessage(conversationId: string, providerId: string, video: string): Promise<any> {
        try {
            const data = {
                conversationId: conversationId,
                providerId: providerId,
                message: video
            }
            const newMessage = new messageModel(data)
            await newMessage.save()
            const conversation = await conversationModel.updateOne({ _id: conversationId}, { updationTime: Date.now()})
            return newMessage
        } catch (error) {
            console.error(error);
            
        }
    }
}
export default messageRepository