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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class chatController {
    constructor(chatCase) {
        this.chatCase = chatCase;
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.query.conversationId;
                const messages = yield this.chatCase.getMessages(conversationId);
                if (messages === null || messages === void 0 ? void 0 : messages.success) {
                    res.status(200).json({ data: messages.data });
                }
                else if (!(messages === null || messages === void 0 ? void 0 : messages.success)) {
                    res.status(200).json({ message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    newConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let senderId;
                let token = req.cookies.userToken;
                if (token) {
                    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                    senderId = decodedToken.id;
                }
                const receiverId = req.query.providerId;
                if (senderId && receiverId) {
                    const newConversation = yield this.chatCase.newConversation(senderId, receiverId);
                    if (newConversation === null || newConversation === void 0 ? void 0 : newConversation.success) {
                        res.status(200).json({ data: newConversation.data });
                    }
                    else {
                        res.status(500).json({ message: "Something went wrong" });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const newMessage = yield this.chatCase.addMessage(data);
                if (newMessage === null || newMessage === void 0 ? void 0 : newMessage.success) {
                    res.status(200).json({ success: true, data: newMessage.data });
                }
                else if (!(newMessage === null || newMessage === void 0 ? void 0 : newMessage.success)) {
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    newImageMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.body.conversationId;
                const providerId = req.body.providerId;
                const imageFile = req.file;
                let image;
                if (imageFile) {
                    image = imageFile.path;
                }
                else {
                    image = '';
                }
                const newMessage = yield this.chatCase.addImageMessage(conversationId, providerId, image);
                if (newMessage === null || newMessage === void 0 ? void 0 : newMessage.success) {
                    res.status(200).json({ success: true, data: newMessage.data });
                }
                else if (!(newMessage === null || newMessage === void 0 ? void 0 : newMessage.success)) {
                    res.status(200).json({ success: false, message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    newVideoMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationId = req.body.conversationId;
                const providerId = req.body.providerId;
                const videoFile = req.file;
                let video;
                if (videoFile) {
                    video = videoFile.path;
                }
                else {
                    video = '';
                }
                const newMessage = yield this.chatCase.addVideoMessage(conversationId, providerId, video);
                if (newMessage === null || newMessage === void 0 ? void 0 : newMessage.success) {
                    res.status(200).json({ success: true, data: newMessage.data });
                }
                else if (!(newMessage === null || newMessage === void 0 ? void 0 : newMessage.success)) {
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                if (providerId) {
                    const conversations = yield this.chatCase.getConversations(providerId);
                    if (conversations === null || conversations === void 0 ? void 0 : conversations.success) {
                        res.status(200).json({ data: conversations.data });
                    }
                    else if (!(conversations === null || conversations === void 0 ? void 0 : conversations.success)) {
                        res.status(500).json({ success: false, message: 'Something went wrong' });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const userFound = yield this.chatCase.findUserById(userId);
                if (userFound === null || userFound === void 0 ? void 0 : userFound.success) {
                    res.status(200).json({ success: true, data: userFound.data });
                }
                else if (!(userFound === null || userFound === void 0 ? void 0 : userFound.success)) {
                    res.status(500).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.default = chatController;
