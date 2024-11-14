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
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET);
class StripePayment {
    makePayment(totalPrice) {
        return __awaiter(this, void 0, void 0, function* () {
            const lineIitems = [
                {
                    priceData: {
                        currency: 'inr',
                        productData: {
                            name: "test"
                        },
                        unitAmount: totalPrice * 100
                    },
                    quantity: 1
                }
            ];
            const session = yield stripe.checkout.sessions.create({
                success_url: 'https://localhost:5000/paymentSuccess',
                cancel_url: 'https://localhost:5000/paymentFail',
                line_items: lineIitems,
                mode: 'payment',
                billing_address_collection: 'required'
            });
            return session.id;
        });
    }
    makeSubscription(providerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const line_items = [{
                        price: process.env.MONTHLY_SUBSCRIPTION_PRICE_ID,
                        quantity: 1
                    }];
                const session = yield stripe.checkout.sessions.create({
                    success_url: 'https://localhost:5000/provider/paymentSuccess',
                    cancel_url: 'https://localhost:5000/provider/paymentFail',
                    payment_method_types: ['card'],
                    mode: 'subscription',
                    line_items: line_items,
                    billing_address_collection: 'required',
                    metadata: { providerId }
                });
                return session.id;
            }
            catch (error) {
                console.error(error);
                throw error;
            }
        });
    }
    refundPayment(paymentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentIntentResponse = yield stripe.paymentIntents.retrieve(paymentId);
                const chargeId = paymentIntentResponse.latest_charge;
                const refund = yield stripe.refunds.create({
                    charge: chargeId
                });
                return refund;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    cancelSubscription(subscriptionId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cancel = yield stripe.subscriptions.cancel(subscriptionId);
                if (cancel) {
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = StripePayment;
