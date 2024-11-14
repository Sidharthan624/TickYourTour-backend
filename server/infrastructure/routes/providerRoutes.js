"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const providerController_1 = __importDefault(require("../../adapters/controllers/providerController"));
const providerRepository_1 = __importDefault(require("../repository/providerRepository"));
const providerUseCase_1 = __importDefault(require("../../useCase/providerUseCase"));
const generateOTP_1 = __importDefault(require("../utils/generateOTP"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const JWTtoken_1 = __importDefault(require("../utils/JWTtoken"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const providerAuth_1 = __importDefault(require("../middleware/providerAuth"));
const multer_1 = require("../middleware/multer");
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const express_1 = __importDefault(require("express"));
const repository = new providerRepository_1.default();
const otp = new generateOTP_1.default();
const mail = new sendEmail_1.default();
const jwt = new JWTtoken_1.default();
const pwd = new hashPassword_1.default();
const cloud = new cloudinary_1.default();
const providerCase = new providerUseCase_1.default(repository, otp, mail, jwt, pwd, cloud);
const controller = new providerController_1.default(providerCase);
const router = express_1.default.Router();
router.post('/verifyEmail', (req, res) => { controller.verifyEmail(req, res); });
router.post('/verifyOtp', (req, res) => { controller.verifyOtp(req, res); });
router.post('/resendOtp', (req, res) => { controller.resendOtp(req, res); });
router.post('/login', (req, res) => { controller.login(req, res); });
router.post('/profile', providerAuth_1.default, (req, res) => { controller.profile(req, res); });
router.post('/editProfile', providerAuth_1.default, (req, res) => { controller.editProfile(req, res); });
router.post('/logout', (req, res) => { controller.logout(req, res); });
router.post('/createPackage', providerAuth_1.default, multer_1.uploadFile.array('image', 5), (req, res) => { controller.createPackage(req, res); });
router.post('/editPackage', providerAuth_1.default, (req, res) => { controller.editPackage(req, res); });
router.post('/providerList', providerAuth_1.default, (req, res) => { controller.providerList(req, res); });
router.post('/getUser', (req, res) => { controller.getUser(req, res); });
router.post('/dashboard', providerAuth_1.default, (req, res) => { controller.dashboard(req, res); });
router.post('/getMonthlySales', providerAuth_1.default, (req, res) => { controller.getMonthlySales(req, res); });
router.post('/getMonthlyRevenue', providerAuth_1.default, (req, res) => { controller.getMonthlyRevenue(req, res); });
router.post('/addReply', (req, res) => { controller.addReply(req, res); });
router.post('/findPackageById', (req, res) => { controller.findPackageById(req, res); });
router.post('/getNotification', providerAuth_1.default, (req, res) => { controller.getNotification(req, res); });
exports.default = router;