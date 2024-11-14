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
class bookingUseCase {
    constructor(iBookingRepository, stripePayment, sendMail) {
        this.iBookingRepository = iBookingRepository,
            this.stripePayment = stripePayment,
            this.sendMail = sendMail;
    }
    newBooking(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newBooking = yield this.iBookingRepository.newBooking(data);
                if (newBooking) {
                    return { success: true, data: newBooking };
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
    getBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBooking = yield this.iBookingRepository.getBooking(bookingId);
                return getBooking;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    proceedForPayment(bookingDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = bookingDetails.packageId.toString();
                let packagePrice;
                const packageFound = yield this.iBookingRepository.findPackageById(packageId);
                if (packageFound) {
                    packagePrice = packageFound.price;
                    const payment = yield this.stripePayment.makePayment(packagePrice);
                    return payment;
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    proceedForSubscription(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const payment = yield this.stripePayment.makeSubscription(providerId);
            return payment;
        });
    }
    saveSession(sessionId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const save = yield this.iBookingRepository.saveSession(sessionId, bookingId);
                if (save) {
                    return { success: true };
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
    updatePaymentStatus(sessionId, paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatePayment = yield this.iBookingRepository.updatePayment(sessionId, paymentId);
                if (updatePayment) {
                    return { success: true };
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
    updateProvider(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateProvider = yield this.iBookingRepository.updateProvider(subscriptionId);
                if (updateProvider) {
                    return { success: true };
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
    getBookings(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBookings = yield this.iBookingRepository.getBookings(userId, page, limit);
                if (getBookings) {
                    return { success: true, bookings: getBookings.typedBook, length: getBookings.totalLength };
                }
                else if (!getBookings) {
                    return { success: false };
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getBookingByProvider(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getBooking = yield this.iBookingRepository.getBookingByProvider(providerId);
                if (getBooking) {
                    return getBooking;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    cancel(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancel = yield this.iBookingRepository.cancel(bookingId);
                if (cancel) {
                    const refund = yield this.stripePayment.refundPayment(cancel.paymentId.payment_intent);
                    if (refund) {
                        return { success: false };
                    }
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
    cancelSubscription(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancel = yield this.iBookingRepository.cancelSubscription(providerId);
                if (cancel) {
                    const cancelSubscription = yield this.stripePayment.cancelSubscription(cancel.subscriptionId.subscriptionId);
                    if (cancelSubscription) {
                        return { success: true };
                    }
                    else if (!cancelSubscription) {
                        return { success: false };
                    }
                }
                return { success: false };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    sendConfirmationMail(sessionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findUser = yield this.iBookingRepository.findPackageBySession(sessionId);
                const name = findUser.user.name;
                const email = findUser.user.email;
                const price = findUser.tourPackage.price;
                const startDate = findUser.booking.startDate;
                const endDate = findUser.booking.endDate;
                const formatDate = (startDateString, endDateString) => {
                    const startDate = new Date(startDateString);
                    const endDate = new Date(endDateString);
                    const startDay = startDate.getDate();
                    const startMonth = startDate.getMonth() + 1;
                    const startYear = startDate.getFullYear() % 100;
                    const formattedStartDate = `${String(startDay).padStart(2, '0')}/${String(startMonth).padStart(2, '0')}/${startYear}`;
                    const endDay = endDate.getDate();
                    const endMonth = endDate.getMonth() + 1;
                    const endYear = endDate.getFullYear() % 100;
                    const formattedEndDate = `${String(endDay).padStart(2, '0')}/${String(endMonth).padStart(2, '0')}/${endYear}`;
                    return {
                        startDateFormatted: formattedStartDate,
                        endDateFormatted: formattedEndDate
                    };
                };
                const { startDateFormatted, endDateFormatted } = formatDate(startDate, endDate);
                const saveAmount = yield this.iBookingRepository.saveAmount(sessionId, price);
                const mail = this.sendMail.sendConfirmationMail(email, name, startDateFormatted, endDateFormatted, price);
                return { success: true };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    saveSubscription(subscriptionId, providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const saveSubscription = yield this.iBookingRepository.saveSubscription(subscriptionId, providerId);
                if (saveSubscription) {
                    return { success: true };
                }
                else if (!saveSubscription) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = bookingUseCase;
