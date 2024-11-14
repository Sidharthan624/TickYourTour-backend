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
const JWTtoken_1 = __importDefault(require("../../infrastructure/utils/JWTtoken"));
const jwt = new JWTtoken_1.default();
class providerController {
    constructor(providerCase) {
        this.providerCase = providerCase;
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerInfo = req.body;
                const providerData = yield this.providerCase.findProvider(providerInfo);
                if (!providerData.data.data) {
                    const token = providerData === null || providerData === void 0 ? void 0 : providerData.data.token;
                    res.status(200).json({ success: true, token: token });
                }
                else {
                    res.status(409).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                console.log('token:', token);
                const providerOtp = req.body.otp;
                const saveProvider = yield this.providerCase.saveProvider(token, providerOtp);
                if (saveProvider === null || saveProvider === void 0 ? void 0 : saveProvider.success) {
                    res.cookie('providerToken', saveProvider.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json({ saveProvider, token: saveProvider.token });
                }
                else {
                    res.status(402).json({ success: false, message: saveProvider ? saveProvider.message : "Verification unsuccessfull..." });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ success: false, message: 'Unauthorized' });
                }
                const decoded = jwt.verifyJwt(token);
                if (decoded) {
                    const providerInfo = decoded.providerInfo;
                    if (providerInfo) {
                        const providerData = yield this.providerCase.findProvider(providerInfo);
                        if (!providerData.data.data) {
                            const token = providerData.data.token;
                            res.status(200).json({ success: true, token: token });
                        }
                        else {
                            res.status(409).json({ success: false });
                        }
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: "Internal server" });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const provider = yield this.providerCase.providerLogin(email, password);
                if (provider === null || provider === void 0 ? void 0 : provider.success) {
                    res.cookie('providerToken', provider.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json({ success: true, token: provider.token });
                }
                else if (!(provider === null || provider === void 0 ? void 0 : provider.success)) {
                    return res.status(200).json({ success: false, message: provider === null || provider === void 0 ? void 0 : provider.message });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    profile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const providerProfile = yield this.providerCase.providerGetProfile(providerId);
                    if (providerProfile) {
                        return res.status(200).json({ success: true, providerProfile });
                    }
                    else {
                        return res.status(200).json({ success: false, message: 'Authentication error' });
                    }
                }
                else {
                    return res.status(401).json({ success: false, message: "User not found" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                const providerInfo = req.body;
                const imageFile = req.file;
                if (imageFile) {
                    providerInfo.image = imageFile.path;
                }
                else {
                    providerInfo.image = '';
                }
                if (providerId) {
                    const updatedData = yield this.providerCase.updateProfile(providerId, providerInfo);
                    if (updatedData) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: " Not updated " });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: "Something went wrong! Try again " });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('providerToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: " Internal server error" });
            }
        });
    }
    createPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('inside create packzasge');
                const providerId = req.providerId;
                const packageInfo = req.body;
                packageInfo.price = parseInt(req.body.price, 10);
                packageInfo.duration = parseInt(req.body.duration, 10);
                packageInfo.groupSize = parseInt(req.body.groupSize, 10);
                const imageFile = req.files;
                packageInfo.photos = imageFile;
                if (providerId) {
                    const create = yield this.providerCase.createPackage(providerId, packageInfo);
                    if (create) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: "There was an error" });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: " Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                const packageInfo = req.body;
                packageInfo.price = parseInt(req.body.price, 10);
                packageInfo.duration = parseInt(req.body.duration, 10);
                packageInfo.groupSize = parseInt(req.body.groupSize, 10);
                const imageFile = req.files;
                packageInfo.photos = imageFile;
                if (providerId) {
                    const create = yield this.providerCase.editPackage(packageInfo, providerId);
                    if (create) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: "There was an error" });
                    }
                }
                else {
                    res.status(401).json({ success: false, message: " Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    providerList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const tourPackage = yield this.providerCase.getPackage(providerId);
                    if (tourPackage) {
                        res.status(200).json({ success: true, getPackage: tourPackage });
                    }
                    else {
                        res.status(401).json({ success: false, message: 'There was an error' });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (userId) {
                    const getUser = yield this.providerCase.getUser(userId);
                    if (getUser === null || getUser === void 0 ? void 0 : getUser.success) {
                        res.status(200).json({ success: true, data: getUser });
                    }
                    else {
                        res.status(200).json({ success: false, message: "Something went wrong" });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const dashboard = yield this.providerCase.dashBoard(providerId);
                    if (dashboard === null || dashboard === void 0 ? void 0 : dashboard.success) {
                        res.status(200).json({ success: true, data: dashboard.dashBoard });
                    }
                    else if (!(dashboard === null || dashboard === void 0 ? void 0 : dashboard.success)) {
                        res.status(200).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMonthlySales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const getMonthlySales = yield this.providerCase.getMonthlySales(providerId);
                    if (getMonthlySales === null || getMonthlySales === void 0 ? void 0 : getMonthlySales.success) {
                        res.status(200).json({ success: true, data: getMonthlySales.getMonthlySales });
                    }
                    else if (!(getMonthlySales === null || getMonthlySales === void 0 ? void 0 : getMonthlySales.success)) {
                        res.status(200).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMonthlyRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const getMonthlyRevenue = yield this.providerCase.getMonthlyRevenue(providerId);
                    if (getMonthlyRevenue === null || getMonthlyRevenue === void 0 ? void 0 : getMonthlyRevenue.success) {
                        res.status(200).json({ success: true, data: getMonthlyRevenue.getMonthlyRevenue });
                    }
                    else if (!(getMonthlyRevenue === null || getMonthlyRevenue === void 0 ? void 0 : getMonthlyRevenue.success)) {
                        res.status(200).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addReply(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reviewId, reply } = req.body;
                const addReply = yield this.providerCase.addReply(reviewId, reply);
                if (addReply) {
                    res.status(200).json({ success: true });
                }
                else if (!addReply) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findPackageById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = req.query.packageId;
                const findPackage = yield this.providerCase.findPackage(packageId);
                if (findPackage === null || findPackage === void 0 ? void 0 : findPackage.success) {
                    res.status(200).json({ success: true, data: findPackage.tourPackage });
                }
                else if (!(findPackage === null || findPackage === void 0 ? void 0 : findPackage.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const notification = yield this.providerCase.getNotification(providerId);
                    if (notification === null || notification === void 0 ? void 0 : notification.success) {
                        res.status(200).json({ success: true, data: notification.notification });
                    }
                    else if (!(notification === null || notification === void 0 ? void 0 : notification.success)) {
                        res.status(200).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.default = providerController;
