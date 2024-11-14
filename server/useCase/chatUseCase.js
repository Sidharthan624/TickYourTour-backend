"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class chatUseCase {
    constructor(iMessageRepository, iConversationRepository, iUserRepository, Cloudinary) {
        this.iConversationRepository = iConversationRepository,
            this.iMessageRepository = iMessageRepository,
            this.iUserRepository = iUserRepository,
            this.cloudinary = Cloudinary;
    }
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield this.iMessageRepository.getMessages(conversationId);
                if (messages) {
                    return { success: true, data: messages };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    newConversation(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newConversation = yield this.iConversationRepository.save(senderId, receiverId);
                if (newConversation) {
                    return { success: true, data: newConversation };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
            }
        });
    }
    addMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newMessage = yield this.iMessageRepository.addMessage(message);
                if (newMessage) {
                    return { success: true, data: newMessage };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addImageMessage(conversationId, providerId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploadImage = yield this.cloudinary.saveToCloudinary(image);
                image = uploadImage;
                const newMessage = yield this.iMessageRepository.addImageMessage(conversationId, providerId, image);
                if (newMessage) {
                    return { success: true, data: newMessage };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addVideoMessage(conversationId, providerId, video) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let upload = yield this.cloudinary.uploadVideo(video);
                video = upload;
                let newMessage = yield this.iMessageRepository.addVideoMessage(conversationId, providerId, video);
                if (newMessage) {
                    return { success: true, data: newMessage };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getConversations(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversation = yield this.iConversationRepository.getConversations(providerId);
                if (conversation) {
                    return { success: true, data: conversation };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.iConversationRepository.findUserById(userId);
                if (userFound) {
                    return { success: true, data: userFound };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = chatUseCase;
