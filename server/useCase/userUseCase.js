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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class userUseCase {
    constructor(iUserRepository, hashPassword, otpGenerate, jwtToken, sendMail, Cloudinary) {
        this.hashPassword = hashPassword;
        this.iUserRepository = iUserRepository;
        this.jwtToken = jwtToken;
        this.otpGenerate = otpGenerate;
        this.sendMail = sendMail,
            this.cloudinary = Cloudinary;
    }
    findUser(userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.iUserRepository.findByEmail(userInfo.email);
                if (userFound) {
                    return {
                        status: 200,
                        data: {
                            data: true,
                            userFound
                        }
                    };
                }
                else {
                    const otp = yield this.otpGenerate.generateOtp(4);
                    console.log(`OTP: ${otp}`);
                    const token = jsonwebtoken_1.default.sign({ userInfo, otp }, process.env.JWT_SECRET, { expiresIn: "5min" });
                    const mail = this.sendMail.sendMail(userInfo.name, userInfo.email, otp);
                    return {
                        status: 200,
                        data: {
                            data: false,
                            token
                        }
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    saveUser(token, userOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.jwtToken.verifyJwt(token);
                console.log('Decoded Token:', decodedToken);
                if (decodedToken) {
                    if (userOtp === decodedToken.otp) {
                        const hashedPassword = yield this.hashPassword.createHash(decodedToken.userInfo.password);
                        decodedToken.userInfo.password = hashedPassword;
                        const userSave = yield this.iUserRepository.saveUser(decodedToken.userInfo);
                        if (userSave) {
                            const createdToken = this.jwtToken.createJwt(userSave._id, "user");
                            return {
                                success: true, token: createdToken
                            };
                        }
                        else {
                            return { success: false, message: "Internal server error" };
                        }
                    }
                    else {
                        return { success: false, message: "Invalid token!" };
                    }
                }
                else {
                    return {
                        success: false, message: "No token!, try again"
                    };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    userLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.iUserRepository.findByEmail(email);
                if (userFound) {
                    const passwordMatch = yield this.hashPassword.compare(password, userFound.password);
                    if (!passwordMatch) {
                        return { success: false, message: "Incorrect password" };
                    }
                    else if (userFound.isBlocked) {
                        return { success: false, message: "This account has been blocked" };
                    }
                    else {
                        const token = this.jwtToken.createJwt(userFound._id, "user");
                        return { success: true, token };
                    }
                }
                else {
                    return { success: false, message: "Email not found" };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    gSignUp(email, name, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.iUserRepository.findByEmail(email);
                if (userFound) {
                    return { status: 200, data: false };
                }
                else {
                    const hashedPassword = yield this.hashPassword.createHash(password);
                    const userSave = yield this.iUserRepository.saveUser({
                        name, email, password: hashedPassword
                    });
                    return { status: 200, data: userSave };
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.iUserRepository.findByEmail(email);
                if (findUser) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFound = yield this.iUserRepository.findByEmail(email);
                if (userFound) {
                    const otp = yield this.otpGenerate.generateOtp(4);
                    let token = jsonwebtoken_1.default.sign({ userFound, otp }, process.env.JWT_SECRET, { expiresIn: '5m' });
                    const mail = yield this.sendMail.sendMail(userFound.name, email, otp);
                    return {
                        status: 200,
                        data: {
                            data: true,
                            token: token
                        }
                    };
                }
                else {
                    return {
                        status: 500,
                        data: {
                            data: false
                        }
                    };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    saveUserForgot(token, userOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.jwtToken.verifyJwt(token);
                if ((decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.otp) == userOtp) {
                    let createdToken = this.jwtToken.createJwt(decodedToken.userFound._id, 'user');
                    return { success: true, token: createdToken };
                }
                else {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    userGetProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.iUserRepository.findUserById(userId);
                return user;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateProfile(id, userInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userExists = yield this.iUserRepository.findUserById(id);
                if (userExists) {
                    let uploadImage = yield this.cloudinary.saveToCloudinary(userInfo.image);
                    userInfo.image = uploadImage;
                    let res = yield this.iUserRepository.updateUser(id, userInfo);
                    return res;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getPackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pckg = yield this.iUserRepository.findPackageId(packageId);
                return pckg;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updatePassword(email, password, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.jwtToken.verifyJwt(token);
                const hashedPassword = yield this.hashPassword.createHash(password);
                if (hashedPassword && decodedToken) {
                    let createdToken = this.jwtToken.createJwt(decodedToken.userFound._id, 'user');
                    const updateUser = yield this.iUserRepository.resetPassword(email, hashedPassword);
                    if (updateUser) {
                        return { success: true, token: createdToken };
                    }
                    return { success: false };
                }
                return { success: false };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    fetchPackage(searchTerm, sortOption, selectedCategory, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetch = yield this.iUserRepository.fetchPackage(searchTerm, sortOption, selectedCategory, page, limit);
                if (fetch) {
                    return { success: true, package: fetch.typedPackage, length: fetch.totalLength };
                }
                else if (!fetch) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    rate(bookingId, rating, review, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rate = yield this.iUserRepository.rate(bookingId, rating, review, userId);
                if (rate) {
                    return { success: true };
                }
                else if (!rate) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editRate(bookingId, rating, review, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rate = yield this.iUserRepository.editRate(bookingId, rating, review, userId);
                if (rate) {
                    return { success: true };
                }
                else if (!rate) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getRating(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRate = yield this.iUserRepository.getRate(packageId);
                if (getRate) {
                    return { success: true, rate: getRate };
                }
                else if (!getRate) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getProvider = yield this.iUserRepository.getProvider(providerId);
                if (getProvider) {
                    return { success: true, getProvider };
                }
                else if (!getProvider) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getRateById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getRate = yield this.iUserRepository.getRateById(bookingId);
                if (getRate) {
                    return { success: true, getRate };
                }
                else if (!getRate) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.iUserRepository.getBookingDetails(bookingId);
                if (booking) {
                    return { success: true, booking };
                }
                else if (!booking) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = userUseCase;
