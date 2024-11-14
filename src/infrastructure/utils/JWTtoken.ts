import IJwtToken from "../../useCase/interfaces/IJWTtoken";
import  jwt, { JwtPayload } from "jsonwebtoken";

class JwtToken implements IJwtToken {
    createJwt(userId: string, role: string): string {
        const jwtKey = process.env.JWT_SECRET
        if(jwtKey) {
            const token: string = jwt.sign({id:userId, role:role}, jwtKey)
            return token
        }
        throw new Error("J")
    }
    verifyJwt(token: string): JwtPayload | null {
        try {
            const jwtKey = process.env.JWT_SECRET as string
        const decode = jwt.verify(token, jwtKey) as JwtPayload
        return decode
        } catch (error) {
            console.log(error);
            return null
        }
    }
}
export default JwtToken