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
class providerUseCase {
    constructor(iProviderRepository, otpGenerate, sendMail, JWTtoken, hashPassword, Cloudinary) {
        this.iProviderRepository = iProviderRepository;
        this.Cloudinary = Cloudinary;
        this.JWTtoken = JWTtoken;
        this.hashPassword = hashPassword;
        this.otpGenerate = otpGenerate;
        this.sendMail = sendMail;
    }
    findProvider(providerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerFound = yield this.iProviderRepository.findByEmail(providerInfo.email);
                if (providerFound) {
                    return {
                        status: 200,
                        data: {
                            data: true,
                            providerFound
                        }
                    };
                }
                else {
                    const otp = yield this.otpGenerate.generateOtp(4);
                    console.log(`Otp sent: ${otp}`);
                    let token = jsonwebtoken_1.default.sign({
                        providerInfo, otp
                    }, process.env.JWT_SECRET, { expiresIn: '5m' });
                    const mail = this.sendMail.sendMail(providerInfo.name, providerInfo.email, otp);
                    return {
                        status: 200,
                        data: {
                            data: false,
                            token: token
                        }
                    };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    saveProvider(token, providerOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let decodedToken = this.JWTtoken.verifyJwt(token);
                if (decodedToken) {
                    if (providerOtp === decodedToken.otp) {
                        const hashedPassword = yield this.hashPassword.createHash(decodedToken.providerInfo.password);
                        decodedToken.providerInfo.password = hashedPassword;
                        const providerSave = yield this.iProviderRepository.saveProvider(decodedToken.providerInfo);
                        if (providerSave) {
                            let createdToken = this.JWTtoken.createJwt(providerSave._id, 'provider');
                            return { success: true, token: createdToken };
                        }
                        else {
                            return { success: false, message: " Internal server error!" };
                        }
                    }
                    else {
                        return { success: false, message: "Incorrect otp" };
                    }
                }
                else {
                    return { success: false, message: "Not token! try again" };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    providerLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerFound = yield this.iProviderRepository.findByEmail(email);
                if (providerFound) {
                    let passwordMatch = yield this.hashPassword.compare(password, providerFound.password);
                    if (!passwordMatch) {
                        return { success: false, message: "Incorrect Password" };
                    }
                    else if (providerFound.isBlocked) {
                        return { success: false, message: "Provider has been blocked by admin!!" };
                    }
                    else {
                        let token = this.JWTtoken.createJwt(providerFound._id, 'provider');
                        return { success: true, token: token };
                    }
                }
                else {
                    return { success: false, message: "Email not found" };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    providerGetProfile(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield this.iProviderRepository.findUserById(providerId);
                return provider;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updateProfile(providerId, providerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let providerExists = yield this.iProviderRepository.findUserById(providerId);
                if (providerExists) {
                    let uploadImage = yield this.Cloudinary.saveToCloudinary(providerInfo.image);
                    providerInfo.image = uploadImage;
                    let res = yield this.iProviderRepository.updateProvider(providerId, providerInfo);
                    return res;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    createPackage(providerId, packageInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let providerExists = yield this.iProviderRepository.findUserById(providerId);
                if (providerExists) {
                    const uploadImages = yield Promise.all(packageInfo.photos.map((file) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.Cloudinary.saveToCloudinary(file.path);
                    })));
                    packageInfo.photos = uploadImages;
                    const mongooseProviderId = providerId;
                    packageInfo.providerId = mongooseProviderId;
                    const addPackage = yield this.iProviderRepository.addPackage(packageInfo, providerId);
                    if (addPackage) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editPackage(packageInfo, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let providerExists = yield this.iProviderRepository.findUserById(providerId);
                if (providerExists) {
                    const uploadImages = yield Promise.all(packageInfo.photos.map((file) => __awaiter(this, void 0, void 0, function* () {
                        return yield this.Cloudinary.saveToCloudinary(file.path);
                    })));
                    packageInfo.photos = uploadImages;
                    const update = yield this.iProviderRepository.editPackage(packageInfo);
                    if (update) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getPackage(providerid) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let providerExists = yield this.iProviderRepository.findUserById(providerid);
                if (providerExists) {
                    const getPackage = yield this.iProviderRepository.getPackageByProviderId(providerid);
                    if (getPackage) {
                        return getPackage;
                    }
                    else {
                        return false;
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userFound = yield this.iProviderRepository.getUser(userId);
                if (userFound) {
                    return { success: true, data: userFound };
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
    dashBoard(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dashBoard = yield this.iProviderRepository.dashboard(providerId);
                if (dashBoard) {
                    return { success: true, dashBoard };
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
    getMonthlySales(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let getMonthlySales = yield this.iProviderRepository.getMonthlySales(providerId);
                if (getMonthlySales) {
                    return { success: true, getMonthlySales };
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
    getMonthlyRevenue(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let getMonthlyRevenue = yield this.iProviderRepository.getMonthlyRevenue(providerId);
                if (getMonthlyRevenue) {
                    return { success: true, getMonthlyRevenue };
                }
                else if (!getMonthlyRevenue) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addReply(reviewId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let addReply = yield this.iProviderRepository.addReply(reviewId, reply);
                if (addReply) {
                    return true;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findPackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tourPackage = yield this.iProviderRepository.findPackage(packageId);
                if (tourPackage) {
                    return { success: true, tourPackage };
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
    getNotification(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield this.iProviderRepository.getNotification(providerId);
                if (notification) {
                    return { success: true, notification };
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
}
exports.default = providerUseCase;
