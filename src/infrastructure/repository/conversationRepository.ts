import Conversation from "../../domain/conversation";
import IConversationRepository from "../../useCase/interfaces/IConversationRepository";
import { UserModel } from "../database/userModel";
import { conversationModel } from "../database/conversationModel";

interface Member {
    userId: string,
    lastSeen?: Date | undefined
}

class conversationRepository implements IConversationRepository {
     async save(senderId: string, receiverId: string): Promise<any> {
         try {
            const conversationExists = await conversationModel.findOne({ members: { $all: [senderId, receiverId]}})
            if(conversationExists) {
                return conversationExists
            }
            const newConversation = new conversationModel({ members: [senderId, receiverId]})
            return await newConversation.save()
         } catch (error) {
            console.error(error);
            
         }
     }
     async getConversations(providerId: string): Promise<any> {
         try {
            const conversations = await conversationModel.find({members: { $in: [providerId]}})
            if(conversations) {
                console.log(conversations);
                return conversations
                
                
            } else {
                return null
            }
         } catch (error) {
            console.error(error);
            
         }
     }
     async findUserById(userId: string): Promise<any> {
         try {
            const findUserById = await UserModel.findById(userId, {name: 1})
            return findUserById
         } catch (error) {
            console.error(error);
            
         }
     }
}
export default conversationRepository