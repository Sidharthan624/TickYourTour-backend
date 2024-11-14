import Message from "../domain/message";
import Conversation from "../domain/conversation";
import IMessageRepository from "./interfaces/IMessageRepository";
import IConversationRepository from "./interfaces/IConversationRepository";
import IUserRepository from "./interfaces/IUserRepository";
import Cloudinary from "../infrastructure/utils/cloudinary";

class chatUseCase {
    private iMessageRepository: IMessageRepository
    private iConversationRepository: IConversationRepository
    private iUserRepository: IUserRepository
    private cloudinary: Cloudinary
    constructor(
        iMessageRepository: IMessageRepository,
        iConversationRepository: IConversationRepository,
        iUserRepository: IUserRepository,
        Cloudinary: Cloudinary
    ) {
        this.iConversationRepository = iConversationRepository,
        this.iMessageRepository = iMessageRepository,
        this.iUserRepository = iUserRepository,
        this.cloudinary = Cloudinary

    }
    async getMessages(conversationId: string) {
        try {
            const messages = await this.iMessageRepository.getMessages(conversationId)
            if(messages) {
                return { success: true, data:messages }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async newConversation(senderId: string, receiverId: string) {
        try {
            const newConversation = await this.iConversationRepository.save(senderId, receiverId)
            if(newConversation) {
                return { success: true, data: newConversation }
            } else {
                return { success: false }
            }
        } catch (error) {
            
        }
    }
    async addMessage(message: Message) {
        try {
            const newMessage = await this.iMessageRepository.addMessage(message)
            if(newMessage) {
                return { success: true, data: newMessage}
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async addImageMessage(conversationId: string, providerId: string, image: string) {
        try {
            const uploadImage = await this.cloudinary.saveToCloudinary(image)
            image = uploadImage
            const newMessage = await this.iMessageRepository.addImageMessage(conversationId, providerId, image)
            if(newMessage) {
                return { success: true, data: newMessage}
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async addVideoMessage(conversationId: string, providerId: string, video: string) {
        try {
            let upload = await  this.cloudinary.uploadVideo(video)
            video = upload
            let newMessage = await this.iMessageRepository.addVideoMessage(conversationId, providerId,video)
            if(newMessage) {
                return { success: true, data: newMessage }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getConversations(providerId: string) {
        try {
            const conversation = await this.iConversationRepository.getConversations(providerId)
            if(conversation) {
                return { success: true, data: conversation }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async findUserById(userId: string) {
        try {
            const userFound = await this.iConversationRepository.findUserById(userId)
            if(userFound) {
                return { success: true, data: userFound }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    
}
export default chatUseCase