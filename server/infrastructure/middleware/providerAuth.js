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
const providerRepository_1 = __importDefault(require("../repository/providerRepository"));
const jwt = new JWTtoken_1.default();
const repository = new providerRepository_1.default();
dotenv_1.default.config();
const providerAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token = req.cookies.providerToken;
    console.log(token);
    console.log('inside auth');
    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No Token provided" });
    }
    try {
        const decodedToken = jwt.verifyJwt(token);
        if (decodedToken && decodedToken.role !== 'provider') {
            return res.status(401).send({ success: false, message: "Unauthorized - Invalid token" });
        }
        if (decodedToken && decodedToken.id) {
            let provider = yield repository.findUserById(decodedToken.id);
            if (decodedToken.isBlocked) {
                return res.status(401).json({ success: false, message: "User has been blocked by Admin" });
            }
            else {
                req.providerId = decodedToken.id;
                next();
            }
        }
        else {
            return res.status(401).json({ success: false, message: "Invalid token" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, message: "Unauthorized - Invalid token" });
    }
});
exports.default = providerAuth;
