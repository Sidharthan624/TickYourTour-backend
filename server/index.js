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
const app_1 = require("./infrastructure/config/app");
const connectDB_1 = require("./infrastructure/config/connectDB");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const PORT = process.env.PORT || 5000;
        const app = (0, app_1.createServer)();
        app === null || app === void 0 ? void 0 : app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        yield (0, connectDB_1.connectDB)();
    }
    catch (error) {
        console.log(error);
    }
});
startServer();
