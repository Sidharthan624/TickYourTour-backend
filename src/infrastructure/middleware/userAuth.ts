import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import UserRepository from "../repository/userRepository";
import JwtToken from "../utils/JWTtoken";
import dotenv from 'dotenv'
dotenv.config()
const jwt = new JwtToken()
const repository = new UserRepository()

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }

    }
}

const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.userToken
    if(!token) {
        return res.status(401).json({ success: false, messsage: "Unauthorized-No token provided"})
    }
    try {
        const decodedToken = jwt.verifyJwt(token)
        if(decodedToken && decodedToken.role !== 'user') {
            
            
            return res.status(401).json({success: false, message: "Unauthorized-Invalid token"})

        }
        
        if(decodedToken && decodedToken.id) {
            const user = await repository.findUserById(decodedToken?.id)
            if(decodedToken.isBlocked) {
                return res.status(401).json({success:false, message: "Unauthorized-User is blocked"})
            } else {
                req.userId = decodedToken.id
                next()
            }

        } else {
            console.log('hiiii');
            
            return res.status(401).json({success:false, message: "Unauthorized-invalid token"})
        }
    } catch(error) {
        console.log(error);

        return res.status(401).json({success:false, message: "Unauthorized-invalid token"})
        
    }
}
export default userAuth