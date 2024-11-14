import Message from "../../domain/message";

interface IMessageRepository {
    getMessages(conversationId: string): Promise<any>,
    addMessage(data: Message): Promise<any>,
    addImageMessage(conversationId: string, providerId: string, image: string): Promise<any>,
    addVideoMessage(conversationId: string, providerId: string, video: string): Promise<any>
}
export default IMessageRepository