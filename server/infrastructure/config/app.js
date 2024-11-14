"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const providerRoutes_1 = __importDefault(require("../routes/providerRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const chatRoutes_1 = __importDefault(require("../routes/chatRoutes"));
const bookingRoutes_1 = __importDefault(require("../routes/bookingRoutes"));
const socketServer_1 = __importDefault(require("./socketServer"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, cookie_parser_1.default)());
        app.use((0, cors_1.default)({
            origin: ['http://localhost:5173'],
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
            optionsSuccessStatus: 200
        }));
        app.use('/api/user', userRoutes_1.default);
        app.use('/api/provider', providerRoutes_1.default);
        app.use('/api/admin', adminRoutes_1.default);
        app.use('/api/chat', chatRoutes_1.default);
        app.use('/api/booking', bookingRoutes_1.default);
        const server = http_1.default.createServer(app);
        (0, socketServer_1.default)(server);
        return server;
    }
    catch (error) {
        console.log(error);
    }
};
exports.createServer = createServer;
