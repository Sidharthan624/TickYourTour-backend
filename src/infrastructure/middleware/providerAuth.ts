import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import JwtToken from "../utils/JWTtoken";
import dotenv from 'dotenv'
import providerRepository from "../repository/providerRepository";
import { decode } from "punycode";

const jwt = new JwtToken()

const repository = new providerRepository()
dotenv.config()

declare global {
    namespace Express {
        interface Request {
            providerId: string
        }
    }
}

const providerAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.providerToken
    if(!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No Token provided"})
    }
    try {
        const decodedToken = jwt.verifyJwt(token)
        if(decodedToken && decodedToken.role !== 'provider') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
        }
        if(decodedToken && decodedToken.id) {
            let provider = await repository.findUserById(decodedToken.id) 
            if(decodedToken.isBlocked) {
                return res.status(401).json({ success: false, message: "User has been blocked by Admin"})
            } else {
                req.providerId = decodedToken.id
                next()
            }
        } else {
           return res.status(401).json({ success: false, message: "Invalid token"})
        }
    } catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token"})
    }
}
export default providerAuth