import chatController from "../../adapters/controllers/chatController";
import messageRepository from "../repository/messageRepository";
import conversationRepository from "../repository/conversationRepository";
import chatUseCase from "../../useCase/chatUseCase";
import UserRepository from "../repository/userRepository";
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middleware/multer";
import express from 'express'


const messagerepository = new messageRepository()
const conversationrepository = new conversationRepository()
const userrepository = new UserRepository()
const cloud = new Cloudinary()
const chatusecase = new chatUseCase(messagerepository, conversationrepository, userrepository,cloud)
const controller = new chatController(chatusecase)

const router = express.Router()

router.get('/getMessages', (req, res) => { controller.getMessages(req, res)})
router.post('/newConversation', (req, res) => { controller.newConversation(req, res)})
router.post('/newMessage', (req, res) => { controller.addMessage(req, res)})
router.get('/getConversations', (req, res) => { controller.getConversation(req, res)})
router.get('/findUserById', (req, res) => { controller.findUserById(req, res)})
router.post('/newImageMessage', uploadFile.single('image'), (req, res) => { controller.newImageMessage(req, res)})
router.post('/newVideoMessage', uploadFile.single('video'), (req, res) => { controller.newVideoMessage(req, res)})

export default router