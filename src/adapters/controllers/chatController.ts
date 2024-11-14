import { Request, Response } from "express";
import Message from "../../domain/message";
import Conversation from "../../domain/conversation";
import chatUseCase from "../../useCase/chatUseCase";
import jwt, { JwtPayload } from 'jsonwebtoken'
import mongoose from "mongoose";

class chatController {
    private chatCase: chatUseCase
    constructor(chatCase: chatUseCase) {
        this.chatCase = chatCase
    }
    async getMessages(req: Request, res: Response) {
        try {
            const conversationId = req.query.conversationId as string
            const messages = await this.chatCase.getMessages(conversationId)
            if(messages?.success) {
                res.status(200).json({ data: messages.data })
            } else if(!messages?.success) {
                res.status(200).json({ message: 'Something went wrong' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async newConversation(req: Request, res: Response) {
        try {
            let senderId
            let token = req.cookies.userToken
            if(token) {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
                senderId = decodedToken.id as string
            }
            const receiverId = req.query.providerId as string
            if(senderId && receiverId) {
                const newConversation = await this.chatCase.newConversation(senderId, receiverId)
                if(newConversation?.success) {
                    res.status(200).json({ data: newConversation.data})
                } else {
                    res.status(500).json({ message: "Something went wrong" })
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async addMessage(req: Request, res: Response) {
        try {
            const data = req.body
            const newMessage = await this.chatCase.addMessage(data)
            if(newMessage?.success) {
                res.status(200).json({ success: true, data: newMessage.data})
            } else if(!newMessage?.success) {
                res.status(500).json({ success: false, message: 'Something went wrong' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async newImageMessage(req: Request, res: Response) {
        try {
            const conversationId = req.body.conversationId
            const providerId = req.body.providerId
            const imageFile: Express.Multer.File | undefined = req.file
            let image
            if(imageFile) {
                image = imageFile.path
            } else {
                image = ''
            }
            const newMessage = await this.chatCase.addImageMessage(conversationId, providerId, image)
            if(newMessage?.success) {
                res.status(200).json({ success: true, data: newMessage.data })
            } else if(!newMessage?.success) {
                res.status(200).json({ success: false, message: 'Something went wrong' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async newVideoMessage(req: Request, res: Response) {
        try {
            const conversationId = req.body.conversationId
            const providerId = req.body.providerId
            const videoFile: Express.Multer.File | undefined = req.file
            let video
            if(videoFile) {
                video = videoFile.path
            }  else {
                video = ''
            }
            const newMessage = await this.chatCase.addVideoMessage(conversationId,providerId,video)
            if(newMessage?.success) {
                res.status(200).json({ success: true, data: newMessage.data})
            } else if(!newMessage?.success) {
                res.status(500).json({ success: false, message: 'Something went wrong' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getConversation(req: Request, res: Response) {
        try {
            const providerId = req.query.providerId as string
            if(providerId) {
                const conversations = await this.chatCase.getConversations(providerId)
                if(conversations?.success) {
                    res.status(200).json({ data: conversations.data})
                } else if(!conversations?.success) {
                    res.status(500).json({ success: false, message: 'Something went wrong' })
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async findUserById(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string
            const userFound = await this.chatCase.findUserById(userId)
            if(userFound?.success) {
                res.status(200).json({ success: true, data: userFound.data})
            } else if(!userFound?.success) {
                res.status(500).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
}
export default chatController