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
const providerModel_1 = require("../database/providerModel");
const packageModel_1 = require("../database/packageModel");
const userModel_1 = require("../database/userModel");
const bookingModel_1 = require("../database/bookingModel");
const ratingModel_1 = require("../database/ratingModel");
const notificationModel_1 = require("../database/notificationModel");
class providerRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerExists = yield providerModel_1.ProviderModel.findOne({ email: email });
                if (providerExists) {
                    return providerExists;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    saveProvider(provider) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProvider = new providerModel_1.ProviderModel(provider);
                yield newProvider.save();
                return newProvider;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let providerData = yield providerModel_1.ProviderModel.findById(id);
                return providerData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    addPackage(packageInfo, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let newPackage = new packageModel_1.PackageModel(packageInfo);
                yield newPackage.save();
                return newPackage;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getPackageByProviderId(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let tourPackage = yield packageModel_1.PackageModel.find({ providerId: providerId });
                if (tourPackage) {
                    return tourPackage;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    editPackage(packageInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatedPackage = yield packageModel_1.PackageModel.updateOne({ _id: packageInfo.id }, {
                    title: packageInfo.title,
                    description: packageInfo.description,
                    destination: packageInfo.destination,
                    price: packageInfo.price,
                    duration: packageInfo.duration,
                    groupSize: packageInfo.groupSize,
                    itinerary: packageInfo.itinerary,
                    photos: packageInfo.photos,
                    transportation: packageInfo.transportation,
                    accommodation: packageInfo.accommodation,
                    rating: packageInfo.rating,
                });
                return updatedPackage;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateProvider(providerId, providerInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updateProvider = yield providerModel_1.ProviderModel.updateOne({ _id: providerId }, providerInfo, { new: true });
                return updateProvider.acknowledged;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userFound = yield userModel_1.UserModel.findOne({ _id: userId });
                return userFound;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    dashboard(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const totalPackages = yield packageModel_1.PackageModel.countDocuments({ providerId: providerId });
                const acceptedPackages = yield packageModel_1.PackageModel.countDocuments({ providerId: providerId });
                const rejectedPackages = yield packageModel_1.PackageModel.countDocuments({ providerId: providerId });
                return { totalPackages, rejectedPackages, acceptedPackages };
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getMonthlySales(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let packageId;
                let tourPackage = yield packageModel_1.PackageModel.findOne({ providerId: providerId });
                if (tourPackage) {
                    packageId = tourPackage._id;
                    const monthlySale = yield bookingModel_1.BookingModel.aggregate([
                        {
                            $match: {
                                packageId: packageId,
                                paymentSuccess: true,
                                isCancelled: false
                            }
                        },
                        {
                            $project: {
                                month: { $month: '$BookingDate' },
                                totalprice: 1
                            }
                        },
                        {
                            $group: {
                                _id: '$month',
                                totalSales: { $sum: 1 }
                            }
                        },
                        {
                            $project: {
                                month: "$_id",
                                totalSales: 1,
                                _id: 0
                            }
                        }
                    ]);
                    return monthlySale;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    getMonthlyRevenue(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let packageIds = [];
                let packages = yield packageModel_1.PackageModel.find({ providerId: providerId });
                if (packages.length > 0) {
                    packageIds = packages.map(tourPackage => tourPackage._id);
                    const monthlyRevenue = yield bookingModel_1.BookingModel.aggregate([
                        {
                            $match: {
                                packageId: { $in: packageIds },
                                paymentSuccess: true,
                                isCancelled: false
                            }
                        },
                        {
                            $project: {
                                month: { $month: '$bookingDate' },
                                totalPrice: 1
                            }
                        },
                        {
                            $group: {
                                _id: "$month",
                                totalRevenue: { $sum: "$totalPrice" }
                            }
                        },
                        {
                            $project: {
                                month: "$_id",
                                totalRevenue: 1,
                                _id: 0
                            }
                        }
                    ]);
                    return monthlyRevenue;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    addReply(reviewId, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let rating = yield ratingModel_1.RatingModel.findOne({ _id: reviewId });
                if (rating) {
                    let addReply = yield ratingModel_1.RatingModel.updateOne({ _id: reviewId }, { reply: reply });
                    return addReply.acknowledged;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    findPackage(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tourPackage = yield packageModel_1.PackageModel.findById(packageId);
                if (tourPackage) {
                    return tourPackage;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getNotification(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const notification = yield notificationModel_1.NotificationModel.find({ providerId: providerId }).populate('packageId');
                const typedNotification = notification.map((notif) => ({
                    id: notif._id,
                    providerId: notif.providerId,
                    packageId: notif.packageId,
                    creationTime: notif.creationTime,
                    notification: notif.notification
                }));
                return typedNotification;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
}
exports.default = providerRepository;
