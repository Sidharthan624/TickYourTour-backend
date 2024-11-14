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
class bookingController {
    constructor(bookingCase) {
        this.bookingCase = bookingCase;
    }
    newBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = req.body;
                const book = yield this.bookingCase.newBooking(data);
                if (book === null || book === void 0 ? void 0 : book.success) {
                    res.status(200).json({ success: true, data: book.data });
                }
                else if (!(book === null || book === void 0 ? void 0 : book.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getCheckout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.params.bookingId;
                if (bookingId) {
                    const getBooking = yield this.bookingCase.getBooking(bookingId);
                    if (getBooking) {
                        res.status(200).json({ success: true, data: getBooking });
                    }
                    else {
                        res.status(500).json({ success: false });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    proceedForPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingDetails = req.body.bookingDetails;
                const payment = yield this.bookingCase.proceedForPayment(bookingDetails);
                if (payment) {
                    res.status(200).json({ success: true, data: payment });
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
    proceedForSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.providerId;
                if (providerId) {
                    const subscription = yield this.bookingCase.proceedForSubscription(providerId);
                    if (subscription) {
                        res.status(200).json({ success: true, data: subscription });
                    }
                    else {
                        res.status(500).json({ success: false, message: "Payment failed" });
                    }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    saveSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sessionId, bookingId } = req.body;
                const save = yield this.bookingCase.saveSession(sessionId, bookingId);
                if (save === null || save === void 0 ? void 0 : save.success) {
                    res.status(200).json({ success: true });
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
    confirmPayment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (req.body.type) {
                    case 'checkout.session.completed':
                        const session = req.body.data.object;
                        if (session.subscription) {
                            return;
                        }
                        const paymentId = session.payment_intent;
                        const sessionId = session.id;
                        const updatePaymentStatus = yield this.bookingCase.updatePaymentStatus(sessionId, paymentId);
                        if (updatePaymentStatus === null || updatePaymentStatus === void 0 ? void 0 : updatePaymentStatus.success) {
                            const sendMail = yield this.bookingCase.sendConfirmationMail(sessionId);
                            if (sendMail === null || sendMail === void 0 ? void 0 : sendMail.success) {
                                res.status(200).json({ success: true });
                            }
                        }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    confirmSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                switch (req.body.type) {
                    case 'checkout.session.completed':
                        const session = req.body.data.object;
                        const subscriptionId = session.subscription;
                        if (!subscriptionId) {
                            return;
                        }
                        const providerId = session.metadata.providerId;
                        const updateProvider = yield this.bookingCase.saveSubscription(subscriptionId, providerId);
                        if (updateProvider === null || updateProvider === void 0 ? void 0 : updateProvider.success) {
                            res.status(200).json({ success: true });
                        }
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getBookings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                const page = Number(req.query.page);
                const limit = Number(req.query.limit);
                const getBooking = yield this.bookingCase.getBookings(userId, page, limit);
                if (getBooking === null || getBooking === void 0 ? void 0 : getBooking.success) {
                    res.status(200).json({ success: true, booking: getBooking.bookings, length: getBooking.length });
                }
                else if (!(getBooking === null || getBooking === void 0 ? void 0 : getBooking.success)) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getBookingsByProviderId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.params.providerId;
                const getBookingsByProvider = yield this.bookingCase.getBookingByProvider(providerId);
                if (getBookingsByProvider) {
                    res.status(200).json({ success: true, data: getBookingsByProvider });
                }
                else if (!getBookingsByProvider) {
                    res.status(500).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    cancelBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookingId = req.body.bookingId;
                const cancel = yield this.bookingCase.cancel(bookingId);
                if (cancel === null || cancel === void 0 ? void 0 : cancel.success) {
                    res.status(200).json({ success: true });
                }
                else if (!(cancel === null || cancel === void 0 ? void 0 : cancel.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    cancelSubscription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.body.providerId;
                const cancel = yield this.bookingCase.cancelSubscription(providerId);
                if (cancel === null || cancel === void 0 ? void 0 : cancel.success) {
                    res.status(200).json({ success: true });
                }
                else if (!(cancel === null || cancel === void 0 ? void 0 : cancel.success)) {
                    res.status(500).json({ succcess: false });
                }
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = bookingController;
