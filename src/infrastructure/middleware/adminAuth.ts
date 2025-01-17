import { NextFunction, Request, Response } from "express";
import JwtToken from "../utils/JWTtoken";
import dotenv from 'dotenv'
dotenv.config()

const jwt = new JwtToken()

declare global {
    namespace Express {
        interface Request {
            adminId?: string
        }
    }
}
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
    let token = req.cookies.adminToken
    if(!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' })
    }
    try {
        const decodedToken = jwt.verifyJwt(token)
        if(decodedToken && decodedToken.role !=='admin') {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' })
        }
        if(decodedToken && decodedToken.id) {
            req.adminId = decodedToken.id
            next()
        } else {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' })
        }
    } catch (error) {
        console.log(error)
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" })
    }
}

export default adminAuth