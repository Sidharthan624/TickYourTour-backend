import Conversation from "../../domain/conversation";

interface IConversationRepository {
    save(senderId: string, receiverId: string): Promise<any>,
    getConversations(providerId: string): Promise<any>,
    findUserById(userId: string): Promise<any>
}
export default IConversationRepository