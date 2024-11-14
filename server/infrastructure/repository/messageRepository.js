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
const messageModel_1 = require("../database/messageModel");
const conversationModel_1 = require("../database/conversationModel");
class messageRepository {
    getMessages(conversationId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield messageModel_1.messageModel.find({ conversationId: conversationId });
                if (messages) {
                    return messages;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addMessage(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const message = {
                    message: data.message,
                    conversationId: data.conversationId,
                    senderId: data.senderId
                };
                const newMessage = new messageModel_1.messageModel(message);
                yield newMessage.save();
                const conversation = yield conversationModel_1.conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() });
                return newMessage;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addImageMessage(conversationId, providerId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    conversationId: conversationId,
                    providerId: providerId,
                    message: image
                };
                const newMessage = new messageModel_1.messageModel(data);
                yield newMessage.save();
                const conversation = yield conversationModel_1.conversationModel.updateOne({ _id: data.conversationId }, { updationTime: Date.now() });
                return newMessage;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addVideoMessage(conversationId, providerId, video) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    conversationId: conversationId,
                    providerId: providerId,
                    message: video
                };
                const newMessage = new messageModel_1.messageModel(data);
                yield newMessage.save();
                const conversation = yield conversationModel_1.conversationModel.updateOne({ _id: conversationId }, { updationTime: Date.now() });
                return newMessage;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = messageRepository;
