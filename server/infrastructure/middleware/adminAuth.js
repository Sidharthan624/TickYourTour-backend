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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JWTtoken_1 = __importDefault(require("../utils/JWTtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt = new JWTtoken_1.default();
const adminAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.cookies.adminToken;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
    }
    try {
        const decodedToken = jwt.verifyJwt(token);
        if (decodedToken && decodedToken.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
        }
        if (decodedToken && decodedToken.id) {
            req.adminId = decodedToken.id;
            next();
        }
        else {
            return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
    }
});
exports.default = adminAuth;
