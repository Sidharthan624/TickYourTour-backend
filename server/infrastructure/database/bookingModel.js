"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSchema = new mongoose_1.Schema({
    packageId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'package',
        required: true
    },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    startDate: {
        type: Date
    },
    endDate: {
        type: Date
    },
    bookingDate: {
        type: Date,
        default: Date.now
    },
    paymentSuccess: {
        type: Boolean,
        default: false
    },
    sessionId: {
        type: String
    },
    isCancelled: {
        type: Boolean,
        default: false
    },
    payment_intent: {
        type: String
    },
    totalPrice: {
        type: Number
    },
    rating: {
        type: Boolean,
        default: false
    }
});
const BookingModel = mongoose_1.default.model('booking', bookingSchema);
exports.BookingModel = BookingModel;
