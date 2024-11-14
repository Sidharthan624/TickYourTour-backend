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
Object.defineProperty(exports, "__esModule", { value: true });
const adminModel_1 = require("../database/adminModel");
const userModel_1 = require("../database/userModel");
const categoryModel_1 = require("../database/categoryModel");
const packageModel_1 = require("../database/packageModel");
const providerModel_1 = require("../database/providerModel");
const bookingModel_1 = require("../database/bookingModel");
const notificationModel_1 = require("../database/notificationModel");
class adminRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminExists = yield adminModel_1.AdminModel.findOne({ email: email });
            if (adminExists) {
                return adminExists;
            }
            else {
                return null;
            }
        });
    }
    findUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.UserModel.find();
            const typedUser = users.map((user) => ({
                id: user._id,
                name: user.name,
                email: user.email,
                password: user.password,
                isBlocked: user.isBlocked,
                image: user.image,
                phone: user.phone,
                createdAt: user.createdAt
            }));
            return typedUser;
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userModel_1.UserModel.findById(id);
            if (user) {
                yield userModel_1.UserModel.findByIdAndUpdate(id, { $set: { isBlocked: !user.isBlocked } });
                return true;
            }
            return false;
        });
    }
    findProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = yield providerModel_1.ProviderModel.find();
            const typedProvider = providers.map((provider) => ({
                id: provider._id,
                name: provider.name,
                email: provider.email,
                password: provider.password,
                isBlocked: provider.isBlocked,
                image: provider.image,
                phone: provider.phone,
                creationTime: provider.creationTime,
                subscriptionId: provider.subscriptionId,
                isVerified: provider.isVerified
            }));
            return typedProvider;
        });
    }
    blockProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let provider = yield providerModel_1.ProviderModel.findById(id);
            if (provider) {
                yield providerModel_1.ProviderModel.findByIdAndUpdate(id, { $set: { isBlocked: !provider.isBlocked } });
                return true;
            }
            return false;
        });
    }
    saveCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingCategory = yield categoryModel_1.CategoryModel.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
                if (existingCategory) {
                    return { duplicate: true, success: true };
                }
                const newCategory = new categoryModel_1.CategoryModel({ name, description });
                yield newCategory.save();
                return { duplicate: false, success: true };
            }
            catch (error) {
                console.error(error);
                return { duplicate: false, success: false };
            }
        });
    }
    findCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield categoryModel_1.CategoryModel.find();
            const typedCategory = categories.map((category) => ({
                id: category._id,
                name: category.name,
                description: category.description,
                isHidden: category.isHidden
            }));
            return typedCategory;
        });
    }
    getBooking() {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.BookingModel.find().populate('packageId').populate('userId').lean();
            const typedBooking = booking.map((book) => ({
                id: book._id,
                packageId: book.packageId,
                userId: book.userId,
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
    hideCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let category = yield categoryModel_1.CategoryModel.findById(id);
            if (category) {
                yield categoryModel_1.CategoryModel.findByIdAndUpdate(id, { $set: { isHidden: !category.isHidden } });
                return true;
            }
            return false;
        });
    }
    editCategory(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield categoryModel_1.CategoryModel.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } });
            if (existingCategory) {
                return { duplicate: true };
            }
            let category = yield categoryModel_1.CategoryModel.findById(id);
            if (category) {
                yield categoryModel_1.CategoryModel.findByIdAndUpdate(id, { $set: { name: name, description: description } });
                return { duplicate: false, success: true };
            }
            return { duplicate: false, success: false };
        });
    }
    findPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const packages = yield packageModel_1.PackageModel.find();
            const typedPackage = packages.map((pckg) => ({
                id: pckg._id,
                providerId: pckg.providerId,
                title: pckg.title,
                description: pckg.description,
                destination: pckg.destination,
                price: pckg.price,
                category: pckg.category,
                duration: pckg.duration,
                groupSize: pckg.groupSize,
                itinerary: pckg.itinerary,
                photos: pckg.photos,
                transportation: pckg.transportation,
                accommodation: pckg.accommodation,
                status: pckg.status,
                rating: pckg.rating,
                creationTime: pckg.creationTime,
            }));
            return typedPackage;
        });
    }
    packageRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const packages = yield packageModel_1.PackageModel.find({ status: 'Verification required' });
            const typedPackages = packages.map((pckg) => ({
                id: pckg._id,
                providerId: pckg.providerId,
                title: pckg.title,
                description: pckg.description,
                destination: pckg.destination,
                price: pckg.price,
                category: pckg.category,
                duration: pckg.duration,
                groupSize: pckg.groupSize,
                itinerary: pckg.itinerary,
                photos: pckg.photos,
                transportation: pckg.transportation,
                accommodation: pckg.accommodation,
                status: pckg.status,
                rating: pckg.rating,
                creationTime: pckg.creationTime,
            }));
            return typedPackages;
        });
    }
    changePackageStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            let tourPackage = yield packageModel_1.PackageModel.findById(id);
            if (tourPackage) {
                yield packageModel_1.PackageModel.findByIdAndUpdate(id, { $set: { status: status } });
                return true;
            }
            return false;
        });
    }
    hidePackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let tourPackage = yield packageModel_1.PackageModel.findById(id);
            if (tourPackage) {
                yield packageModel_1.PackageModel.findByIdAndUpdate(id, { $set: { isBlocked: !tourPackage.isBlocked } });
                return true;
            }
            return false;
        });
    }
    findCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let category = yield categoryModel_1.CategoryModel.findOne({ _id: categoryId });
                if (category) {
                    return category;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    fetchBooking(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let bookings;
                if (filter.trim().length > 0) {
                    const tourPackage = yield packageModel_1.PackageModel.findOne({ title: filter });
                    if (tourPackage) {
                        bookings = yield bookingModel_1.BookingModel.find({ packageId: tourPackage._id }).populate('packageId').populate('userId');
                        const typedBookings = bookings.map((booking) => ({
                            id: booking.id,
                            packageId: booking.packageId,
                            userId: booking.userId,
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            bookingDate: booking.bookingDate,
                            paymentSuccess: booking.paymentSuccess,
                            sessionId: booking.sessionId,
                            isCancelled: booking.isCancelled,
                            payment_intent: booking.payment_intent,
                            totalPrice: booking.totalPrice,
                            rating: booking.rating
                        }));
                        return typedBookings;
                    }
                    else {
                        bookings = yield bookingModel_1.BookingModel.find().populate('packageId').populate('userId');
                        const typedBookings = bookings.map((booking) => ({
                            id: booking.id,
                            packageId: booking.packageId,
                            userId: booking.userId,
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            bookingDate: booking.bookingDate,
                            paymentSuccess: booking.paymentSuccess,
                            sessionId: booking.sessionId,
                            isCancelled: booking.isCancelled,
                            payment_intent: booking.payment_intent,
                            totalPrice: booking.totalPrice,
                            rating: booking.rating
                        }));
                        return typedBookings;
                    }
                }
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalUsers = yield userModel_1.UserModel.countDocuments();
                const blockedUsers = yield userModel_1.UserModel.countDocuments({ isBlocked: true });
                const totalProviders = yield providerModel_1.ProviderModel.countDocuments();
                const blockedProviders = yield providerModel_1.ProviderModel.countDocuments({ isBlocked: true });
                const totalPackages = yield packageModel_1.PackageModel.countDocuments();
                const rejectedPackages = yield packageModel_1.PackageModel.countDocuments({ status: 'Rejected' });
                return { totalUsers, totalPackages, totalProviders, rejectedPackages, blockedUsers, blockedProviders };
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getMonthlySales() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlySales = bookingModel_1.BookingModel.aggregate([
                    {
                        $group: {
                            _id: { $month: '$bookingDate' },
                            totalSales: { $sum: 1 }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            month: '$_id',
                            totalSales: 1
                        }
                    }
                ]);
                return monthlySales;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getMonthlyRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyRevenue = yield bookingModel_1.BookingModel.aggregate([
                    {
                        $match: { paymentSuccess: true, isCancelled: false }
                    },
                    {
                        $project: {
                            month: { $month: '$bookingDate' },
                            totalPrice: 1
                        }
                    },
                    {
                        $group: {
                            _id: '$month',
                            totalRevenue: { $sum: '$totalPrice' }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            month: '$_id',
                            totalRevenue: 1
                        }
                    }
                ]);
                return monthlyRevenue;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    addNotification(providerId, notification, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newNotification = new notificationModel_1.NotificationModel({
                    providerId: providerId,
                    packageId: id,
                    notification: notification,
                    creationTime: Date.now()
                });
                yield newNotification.save();
                return newNotification;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
exports.default = adminRepository;
