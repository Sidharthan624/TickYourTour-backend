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
const userModel_1 = require("../database/userModel");
const packageModel_1 = require("../database/packageModel");
const ratingModel_1 = require("../database/ratingModel");
const bookingModel_1 = require("../database/bookingModel");
const providerModel_1 = require("../database/providerModel");
class UserRepository {
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const buyerExists = yield userModel_1.UserModel.findOne({ email });
                if (buyerExists) {
                    return buyerExists;
                }
                else {
                    return null;
                }
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let userData = yield userModel_1.UserModel.findById(id);
                return userData;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new userModel_1.UserModel(user);
                yield newUser.save();
                return newUser;
            }
            catch (error) {
                console.log(error);
                return null;
            }
        });
    }
    resetPassword(email, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updatePassword = yield userModel_1.UserModel.updateOne({ email }, { password: hashedPassword });
                if (updatePassword) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    updateUser(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let updateUser = yield userModel_1.UserModel.updateOne({ _id: id }, user, { new: true });
                return updateUser.acknowledged;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    findPackageId(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let packageData = yield packageModel_1.PackageModel.findById(packageId);
                return packageData;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
    fetchPackage(searchTerm, sortOption, selectedCategory, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = { status: 'Accepted' };
                if (searchTerm) {
                    query.$or = [
                        { title: { $regex: searchTerm, $options: 'i' } },
                        { address: { $regex: searchTerm, $options: 'i' } }
                    ];
                }
                if (selectedCategory) {
                    query.category = selectedCategory;
                }
                let sort = {};
                if (sortOption === 'Low to High') {
                    sort = { price: 1 };
                }
                else if (sortOption === 'High to Low') {
                    sort = { price: -1 };
                }
                else if (sortOption === 'Sort') {
                    sort = { price: 1 };
                }
                const packages = yield packageModel_1.PackageModel
                    .find(query)
                    .sort(sort)
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('providerId')
                    .exec();
                const typedPackage = packages.map((pkg) => ({
                    id: pkg.id,
                    providerId: pkg.providerId,
                    title: pkg.title,
                    description: pkg.description,
                    destination: pkg.destination,
                    price: pkg.price,
                    category: pkg.category,
                    duration: pkg.duration,
                    groupSize: pkg.groupSize,
                    itinerary: pkg.itinerary,
                    photos: pkg.photos,
                    transportation: pkg.transportation,
                    accommodation: pkg.accommodation,
                    status: pkg.status,
                    rating: pkg.rating,
                    creationTime: pkg.creationTime,
                }));
                const total = yield packageModel_1.PackageModel.find();
                let totalLength;
                if (total) {
                    totalLength = total.length;
                }
                return { typedPackage, totalLength };
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    rate(bookingId, rating, review, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRate = new ratingModel_1.RatingModel({ bookingId: bookingId, rating: rating, review: review, userId: userId });
                yield newRate.save();
                const booking = yield bookingModel_1.BookingModel.updateOne({ _id: bookingId }, { rating: true });
                return newRate;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    editRate(bookingId, rating, review, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ratings = yield ratingModel_1.RatingModel.updateOne({ bookingId: bookingId }, { $set: { rating: rating, review: review } });
                if (ratings) {
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
    getRate(packageId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookings = yield bookingModel_1.BookingModel.find({ packageId });
                const bookingIds = bookings.map(booking => booking._id);
                const ratings = yield ratingModel_1.RatingModel.find({ bookingId: { $in: bookingIds } }).populate('userId').populate('bookingId');
                const typedRatings = ratings.map((rate) => ({
                    id: rate.id,
                    bookingId: rate.bookingId,
                    userId: rate.userId,
                    rating: rate.rating,
                    review: rate.review,
                    reply: rate.reply
                }));
                return typedRatings;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (providerId) {
                    const provider = yield providerModel_1.ProviderModel.findOne({ _id: providerId });
                    if (provider) {
                        return provider;
                    }
                    return false;
                }
                return false;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getRateById(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findRating = yield ratingModel_1.RatingModel.findOne({ bookingId: bookingId });
                if (findRating) {
                    return findRating;
                }
                return false;
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
    getBookingDetails(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findBooking = yield bookingModel_1.BookingModel.findOne({ _id: bookingId }).populate('userId').populate('packageId');
                if (findBooking) {
                    return findBooking;
                }
                else {
                    return false;
                }
            }
            catch (error) {
                console.error(error);
                return false;
            }
        });
    }
}
exports.default = UserRepository;
