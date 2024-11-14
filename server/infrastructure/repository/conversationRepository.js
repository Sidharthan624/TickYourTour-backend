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
const userModel_1 = require("../database/userModel");
const conversationModel_1 = require("../database/conversationModel");
class conversationRepository {
    save(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversationExists = yield conversationModel_1.conversationModel.findOne({ members: { $all: [senderId, receiverId] } });
                if (conversationExists) {
                    return conversationExists;
                }
                const newConversation = new conversationModel_1.conversationModel({ members: [senderId, receiverId] });
                return yield newConversation.save();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getConversations(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const conversations = yield conversationModel_1.conversationModel.find({ members: { $in: [providerId] } });
                if (conversations) {
                    return conversations;
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
    findUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUserById = yield userModel_1.UserModel.findById(userId, { name: 1 });
                return findUserById;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = conversationRepository;
