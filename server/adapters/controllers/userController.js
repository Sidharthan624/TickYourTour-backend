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
const console_1 = require("console");
const jwt = new JWTtoken_1.default();
class userController {
    constructor(usercase) {
        this.usercase = usercase;
    }
    verifyEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userInfo = req.body;
                const userData = yield this.usercase.findUser(userInfo);
                if (!userData.data.data) {
                    const token = userData === null || userData === void 0 ? void 0 : userData.data.token;
                    res.status(200).json({ success: true, token: token });
                }
                else {
                    res.status(200).json({ success: false, message: " User already exists" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "internal server error " });
            }
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                (0, console_1.log)('hi');
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const userOtp = req.body.otp;
                const saveUser = yield this.usercase.saveUser(token, userOtp);
                if (saveUser === null || saveUser === void 0 ? void 0 : saveUser.success) {
                    res.cookie("userToken", saveUser.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json({ success: true, token: saveUser.token });
                }
                else if (!(saveUser === null || saveUser === void 0 ? void 0 : saveUser.success)) {
                    res.status(200).json({ message: saveUser ? saveUser.message : "Verification failed" });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    resendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
                if (!token) {
                    return res.status(401).json({ success: false, message: "Unauthorized" });
                }
                const decoded = jwt.verifyJwt(token);
                if (decoded) {
                    const userInfo = decoded.userInfo;
                    if (userInfo) {
                        const userData = yield this.usercase.findUser(userInfo);
                        if (!userData.data.data) {
                            const token = userData === null || userData === void 0 ? void 0 : userData.data.token;
                            res.status(200).json({ success: true, token: token });
                        }
                    }
                    else {
                        res.status(409).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    gSignUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, password } = req.body;
                const user = this.usercase.gSignUp(name, email, password);
                return res.status(200).json(user);
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: "Internal server error " });
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this.usercase.userLogin(email, password);
                if (user === null || user === void 0 ? void 0 : user.success) {
                    res.cookie("userToken", user.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json({ success: true, token: user.token });
                }
                else if (!(user === null || user === void 0 ? void 0 : user.success)) {
                    res.status(200).json({ success: false, message: user === null || user === void 0 ? void 0 : user.message });
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie("userToken", "", {
                    httpOnly: true,
                    expires: new Date(0)
                });
                return res.status(200).json({ success: true });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                const { email, password } = req.body;
                const userFound = yield this.usercase.findUserByEmail(email);
                if (userFound) {
                    const updatePassword = yield this.usercase.updatePassword(email, password, token);
                    if (updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.success) {
                        res.status(200).json({ success: true, message: 'Successfully logged in', token: updatePassword.token });
                    }
                    else if (!(updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.success)) {
                        res.status(500).json({ success: false, message: "Something went wrong" });
                    }
                }
                else {
                    res.status(404).json({ success: false, message: "No user found with this email" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const userExists = yield this.usercase.forgotPassword(email);
                if (userExists === null || userExists === void 0 ? void 0 : userExists.data.data) {
                    const token = userExists.data.token;
                    res.status(200).json({ success: true, token: token });
                }
                else {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    verifyOtpForgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split('')[1];
                const userOtp = req.body.otp;
                const save = yield this.usercase.saveUserForgot(token, userOtp);
                if (save === null || save === void 0 ? void 0 : save.success) {
                    res.cookie('userToken', save === null || save === void 0 ? void 0 : save.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json({ success: true, token: save.token });
                }
                else {
                    return res.status(200).json({ success: false, message: "Invalid otp" });
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
                const userId = req.userId;
                if (userId) {
                    const userProfile = yield this.usercase.userGetProfile(userId);
                    if (userProfile) {
                        return res.status(200).json({ success: true, userProfile });
                    }
                    else {
                        return res.status(401).json({ success: false, message: 'Authentication error' });
                    }
                }
                else {
                    return res.status(404).json({ success: false, message: "User Id not found" });
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
                const userId = req.userId;
                const userInfo = req.body;
                const imageFile = req.file;
                if (imageFile) {
                    userInfo.image = imageFile.path;
                }
                else {
                    userInfo.image = '';
                }
                if (userId) {
                    const updateData = yield this.usercase.updateProfile(userId, userInfo);
                    if (updateData) {
                        res.status(200).json({ success: true });
                    }
                    else {
                        res.status(401).json({ success: false, message: "Not updated!" });
                    }
                }
                else {
                    res.status(500).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    singlePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = req.params.id;
                if (packageId) {
                    const getPackage = yield this.usercase.getPackage(packageId);
                    if (getPackage) {
                        res.status(200).json({ success: true, getPackage });
                    }
                    else {
                        res.status(401).json({ success: false, message: "Something went wrong" });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    fetchPackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const searchTerm = req.query.searchTerm;
                const sortOption = req.query.sortOption;
                const selectedCategory = req.query.selectedCategory;
                const limit = Number(req.query.limit);
                const page = Number(req.query.page);
                const fetch = yield this.usercase.fetchPackage(searchTerm, sortOption, selectedCategory, page, limit);
                if (fetch === null || fetch === void 0 ? void 0 : fetch.success) {
                    res.status(200).json({ success: true, packages: fetch.package, totalPackages: fetch.length, });
                }
                else if (!(fetch === null || fetch === void 0 ? void 0 : fetch.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false });
            }
        });
    }
    rate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, rating, review, userId } = req.body;
                const rate = yield this.usercase.rate(bookingId, rating, review, userId);
                if (rate === null || rate === void 0 ? void 0 : rate.success) {
                    res.status(200).json({ success: true });
                }
                else if (!(rate === null || rate === void 0 ? void 0 : rate.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editRate(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { bookingId, rating, review, userId } = req.body;
                const rate = yield this.usercase.editRate(bookingId, rating, review, userId);
                if (rate === null || rate === void 0 ? void 0 : rate.success) {
                    res.status(200).json({ success: true });
                }
                else if (!(rate === null || rate === void 0 ? void 0 : rate.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = req.query.id;
                const ratings = yield this.usercase.getRating(packageId);
                if (ratings === null || ratings === void 0 ? void 0 : ratings.success) {
                    res.status(200).json({ success: true, data: ratings.rate });
                }
                else if (!(ratings === null || ratings === void 0 ? void 0 : ratings.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.query.providerId;
                const providerData = yield this.usercase.getProvider(providerId);
                if (providerData === null || providerData === void 0 ? void 0 : providerData.success) {
                    res.status(200).json({ success: true, data: providerData.getProvider });
                }
                else if (!(providerData === null || providerData === void 0 ? void 0 : providerData.success)) {
                    res.status(500).json({ succes: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findRatingById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.query.bookingId;
                const rateData = yield this.usercase.getRateById(bookingId);
                if (rateData === null || rateData === void 0 ? void 0 : rateData.success) {
                    res.status(200).json({ success: true, data: rateData.getRate });
                }
                else if (!(rateData === null || rateData === void 0 ? void 0 : rateData.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getBookingDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.query.bookingId;
                const booking = yield this.usercase.getBookingDetails(bookingId);
                if (booking === null || booking === void 0 ? void 0 : booking.success) {
                    res.status(200).json({ success: true, data: booking.booking });
                }
                else if (!(booking === null || booking === void 0 ? void 0 : booking.success)) {
                    res.status(500).json({ succes: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.userId;
                if (userId) {
                    const userProfile = yield this.usercase.userGetProfile(userId);
                    if (userProfile) {
                        return res.status(200).json({ success: true, userProfile });
                    }
                    else {
                        return res.status(401).json({ success: false, message: 'Authentication error' });
                    }
                }
                else {
                    return res.status(404).json({ success: false, message: 'User Id not found' });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
}
exports.default = userController;
