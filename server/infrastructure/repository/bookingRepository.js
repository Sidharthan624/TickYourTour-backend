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
const bookingModel_1 = require("../database/bookingModel");
const packageModel_1 = require("../database/packageModel");
const providerModel_1 = require("../database/providerModel");
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = require("../database/userModel");
class bookingRepository {
    newBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBooking = new bookingModel_1.BookingModel(data);
                yield newBooking.save();
                return newBooking;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bookingData = yield bookingModel_1.BookingModel.findById(bookingId);
                return bookingData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findPackageById(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageData = yield packageModel_1.PackageModel.findById(packageId);
                return packageData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    saveSession(sessionId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.BookingModel.findById(bookingId);
                if (booking) {
                    yield bookingModel_1.BookingModel.findByIdAndUpdate({ _id: bookingId }, { $set: { sessionId: sessionId } });
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    updatePayment(sessionId, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield bookingModel_1.BookingModel.findOne({ sessionId: sessionId });
                if (payment) {
                    yield bookingModel_1.BookingModel.updateOne({ sessionId: sessionId }, { $set: { paymentSuccess: true, payment_intent: paymentId } });
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    updateProvider(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerModel_1.ProviderModel.findOne({ subscriptionId: subscriptionId });
                if (provider) {
                    yield providerModel_1.ProviderModel.updateOne({ subscriptionId: subscriptionId }, { $set: { isVerified: true } });
                    return true;
                }
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    saveAmount(sessionId, totalPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payment = yield bookingModel_1.BookingModel.findOne({ sessionId: sessionId });
                if (payment) {
                    yield bookingModel_1.BookingModel.updateOne({ sessionId: sessionId }, { $set: { totalPrice: totalPrice } });
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getBookings(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.BookingModel.find({ userId: userId })
                    .sort({ bookingDate: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('packageId');
                const typedBooking = booking.map((book) => ({
                    id: book._id,
                    userId: book.userId,
                    packageId: book.packageId,
                    startDate: book.startDate,
                    endDate: book.endDate,
                    bookingDate: book.bookingDate,
                    paymentSuccess: book.paymentSuccess,
                    sessionId: book.sessionId,
                    isCancelled: book.isCancelled,
                    payment_intent: book.payment_intent,
                    totalPrice: book.totalPrice,
                    rating: book.rating
                }));
                const totalLength = yield bookingModel_1.BookingModel.countDocuments({ userId: userId });
                return { typedBooking, totalLength };
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getBookingByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tourPackage = yield packageModel_1.PackageModel.findOne({ providerId: new mongoose_1.default.Types.ObjectId(providerId) });
            const packageId = tourPackage === null || tourPackage === void 0 ? void 0 : tourPackage.id;
            const booking = yield bookingModel_1.BookingModel.find({ packageId: packageId }).populate('packageId').populate('userId');
            const typedBooking = booking.map((book) => ({
                id: book.id,
                userId: book.userId,
                packageId: book.packageId,
                startDate: book.startDate,
                endDate: book.endDate,
                bookingDate: book.bookingDate,
                paymentSuccess: book.paymentSuccess,
                sessionId: book.sessionId,
                isCancelled: book.isCancelled,
                payment_intent: book.payment_intent,
                totalPrice: book.totalPrice,
                rating: book.rating
            }));
            return typedBooking;
        });
    }
    cancel(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.BookingModel.findOne({ _id: bookingId });
                if (booking) {
                    yield bookingModel_1.BookingModel.updateOne({ _id: bookingId }, { $set: { isCancelled: true } });
                    const paymentId = yield bookingModel_1.BookingModel.findOne({ _id: bookingId }, { payment_intent: 1 });
                    return paymentId;
                }
                return false;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    cancelSubscription(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerModel_1.ProviderModel.findOne({ _id: providerId });
                if (provider) {
                    yield providerModel_1.ProviderModel.updateOne({ _id: providerId }, { $set: { isVerified: false } }, { upsert: true });
                    const subscriptionId = yield providerModel_1.ProviderModel.findOne({ _id: providerId }, { subscriptionId: 1 });
                    return { subscriptionId };
                }
                return false;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findPackageBySession(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield bookingModel_1.BookingModel.findOne({ sessionId: sessionId }).populate('userId').populate('packageId');
                if (booking) {
                    const userId = booking.userId;
                    const packageId = booking.packageId;
                    const user = yield userModel_1.UserModel.findOne({ _id: userId });
                    const tourPackage = yield packageModel_1.PackageModel.findOne({ _id: packageId });
                    return { booking, user, tourPackage };
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    saveSubscription(subscriptionId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const provider = yield providerModel_1.ProviderModel.findOne({ _id: providerId });
                if (provider) {
                    yield providerModel_1.ProviderModel.updateOne({ _id: providerId }, { $set: { isVerified: true, subscriptionId: subscriptionId } });
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
exports.default = bookingRepository;
