"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JwtToken {
    createJwt(userId, role) {
        const jwtKey = process.env.JWT_SECRET;
        if (jwtKey) {
            const token = jsonwebtoken_1.default.sign({ id: userId, role: role }, jwtKey);
            return token;
        }
        throw new Error("J");
    }
    verifyJwt(token) {
        try {
            const jwtKey = process.env.JWT_SECRET;
            const decode = jsonwebtoken_1.default.verify(token, jwtKey);
            return decode;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    }
}
exports.default = JwtToken;
