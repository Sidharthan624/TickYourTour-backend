"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatController_1 = __importDefault(require("../../adapters/controllers/chatController"));
const messageRepository_1 = __importDefault(require("../repository/messageRepository"));
const conversationRepository_1 = __importDefault(require("../repository/conversationRepository"));
const chatUseCase_1 = __importDefault(require("../../useCase/chatUseCase"));
const userRepository_1 = __importDefault(require("../repository/userRepository"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const multer_1 = require("../middleware/multer");
const express_1 = __importDefault(require("express"));
const messagerepository = new messageRepository_1.default();
const conversationrepository = new conversationRepository_1.default();
const userrepository = new userRepository_1.default();
const cloud = new cloudinary_1.default();
const chatusecase = new chatUseCase_1.default(messagerepository, conversationrepository, userrepository, cloud);
const controller = new chatController_1.default(chatusecase);
const router = express_1.default.Router();
router.get('/getMessages', (req, res) => { controller.getMessages(req, res); });
router.post('/newConversation', (req, res) => { controller.newConversation(req, res); });
router.post('/newMessage', (req, res) => { controller.addMessage(req, res); });
router.get('/getConversation', (req, res) => { controller.getConversation(req, res); });
router.get('/findUserById', (req, res) => { controller.findUserById(req, res); });
router.post('/newImageMessage', multer_1.uploadFile.single('image'), (req, res) => { controller.newImageMessage(req, res); });
router.post('/newVideoMessage', multer_1.uploadFile.single('video'), (req, res) => { controller.newVideoMessage(req, res); });
exports.default = router;