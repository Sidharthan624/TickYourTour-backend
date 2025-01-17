"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adminController_1 = __importDefault(require("../../adapters/controllers/adminController"));
const adminRepository_1 = __importDefault(require("../repository/adminRepository"));
const adminUseCase_1 = __importDefault(require("../../useCase/adminUseCase"));
const express_1 = __importDefault(require("express"));
const hashPassword_1 = __importDefault(require("../utils/hashPassword"));
const JWTtoken_1 = __importDefault(require("../utils/JWTtoken"));
const adminAuth_1 = __importDefault(require("../middleware/adminAuth"));
const repository = new adminRepository_1.default();
const hashPass = new hashPassword_1.default();
const jwt = new JWTtoken_1.default();
const adminCase = new adminUseCase_1.default(repository, hashPass, jwt);
const controller = new adminController_1.default(adminCase);
const router = express_1.default.Router();
router.post('/login', (req, res) => { controller.login(req, res); });
router.post('/logout', (req, res) => { controller.logout(req, res); });
router.get('/user', adminAuth_1.default, (req, res) => { controller.user(req, res); });
router.post('blockUser/:id', adminAuth_1.default, (req, res) => { controller.blockUser(req, res); });
router.post('/provider', adminAuth_1.default, (req, res) => { controller.provider(req, res); });
router.post('/blockProvider/:id', (req, res) => { controller.blockProvider(req, res); });
router.post('/addCategory', adminAuth_1.default, (req, res) => { controller.addCategory(req, res); });
router.post('/category', (req, res) => { controller.category(req, res); });
router.post('/hideCategory', adminAuth_1.default, (req, res) => { controller.hideCategory(req, res); });
router.post('/editCategory', adminAuth_1.default, (req, res) => { controller.editCategory(req, res); });
router.get('/package', adminAuth_1.default, (req, res) => { controller.package(req, res); });
router.post('/packageStatusChange', adminAuth_1.default, (req, res) => { controller.packageStatusChange(req, res); });
router.post('/hidePackage', adminAuth_1.default, (req, res) => { controller.hidePackage(req, res); });
router.get('/findCategory', adminAuth_1.default, (req, res) => { controller.findCategory(req, res); });
router.get('/getBooking', adminAuth_1.default, (req, res) => { controller.getBooking(req, res); });
router.get('/fetchBooking', adminAuth_1.default, (req, res) => { controller.fetchBooking(req, res); });
router.get('/dashboard', adminAuth_1.default, (req, res) => { controller.dashboard(req, res); });
router.get('/getMonthlySales', adminAuth_1.default, (req, res) => { controller.getMonthlySales(req, res); });
router.get('/getMonthlyRevenue', adminAuth_1.default, (req, res) => { controller.getMonthlyRevenue(req, res); });
router.get('/packageRequest', adminAuth_1.default, (req, res) => { controller.packageRequest(req, res); });
router.post('/addNotification', adminAuth_1.default, (req, res) => { controller.addNotification(req, res); });
exports.default = router;
