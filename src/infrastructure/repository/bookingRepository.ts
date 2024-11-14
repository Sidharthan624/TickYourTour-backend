import Booking from "../../domain/booking";
import { BookingModel } from "../database/bookingModel";
import { PackageModel } from "../database/packageModel";
import IBookingRepository from "../../useCase/interfaces/IBookingRepository";
import Package from "../../domain/package";
import { ObjectId } from "mongoose";
import { ProviderModel } from "../database/providerModel";
import mongoose from "mongoose";
import { UserModel } from "../database/userModel";

interface GetBookingResponse {
    typedBooking: Booking[],
    totalLength: number
}
class bookingRepository implements IBookingRepository {
    async newBooking(data: Booking): Promise<Booking | null> {
        try {
            const newBooking = new BookingModel(data)
            await newBooking.save()
            return newBooking
        } catch (error) {
            console.error(error);
            return null
            
        }
    }
    async getBooking(bookingId: string): Promise<Booking | null> {
        try {
            let bookingData: Booking | null = await BookingModel.findById(bookingId)
            return bookingData
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async findPackageById(packageId: string): Promise<Package | null> {
        try {
            const packageData: Package | null = await PackageModel.findById(packageId)
            return packageData
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async saveSession(sessionId: string, bookingId: string): Promise<any> {
        try {
            const booking = await BookingModel.findById(bookingId)
            if(booking) {
                await BookingModel.findByIdAndUpdate({ _id: bookingId}, { $set: { sessionId: sessionId }})
                return true
            } 
            return false
        } catch (error) {
            console.error(error);
            
        }
    }
    async updatePayment(sessionId: string, paymentId: string): Promise<any> {
        try {
            const payment = await BookingModel.findOne({ sessionId: sessionId})
            if(payment) {
                await BookingModel.updateOne({ sessionId: sessionId}, { $set: { paymentSuccess: true, payment_intent: paymentId }})
                return true
            }
            return false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async updateProvider(subscriptionId: string): Promise<any> {
        try {
            const provider = await ProviderModel.findOne({ subscriptionId: subscriptionId})
            if(provider) {
                await ProviderModel.updateOne({ subscriptionId: subscriptionId}, {$set: { isVerified: true}})
                return true
            }
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async saveAmount(sessionId: string, totalPrice: number): Promise<any> {
        try {
            const payment = await BookingModel.findOne({ sessionId: sessionId })
            if(payment) {
                await BookingModel.updateOne({ sessionId: sessionId }, { $set: { totalPrice: totalPrice}})
                return true
            }
            return false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async  getBookings(userId: string, page: number, limit: number): Promise<GetBookingResponse | false> {
        try {
            const booking = await BookingModel.find({ userId: userId})
            .sort({ bookingDate: -1})
            .skip((page -1) * limit)
            .limit(limit)
            .populate('packageId')
            const typedBooking: Booking[] = booking.map((book: any) =>({
                id: book._id,
                userId: book.userId as ObjectId,
                packageId: book.packageId as ObjectId,
                startDate: book.startDate,
                endDate: book.endDate,
                bookingDate: book.bookingDate,
                paymentSuccess: book.paymentSuccess,
                sessionId: book.sessionId,
                isCancelled: book.isCancelled,
                payment_intent: book.payment_intent,
                totalPrice: book.totalPrice,
                rating: book.rating
            }) )
            const totalLength = await BookingModel.countDocuments({ userId: userId})
            return { typedBooking, totalLength}
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async getBookingByProvider(providerId: string): Promise<Booking[]> {
        const tourPackage = await PackageModel.findOne({ providerId: new mongoose.Types.ObjectId(providerId)})
        const packageId = tourPackage?.id
        const booking: Booking[] = await BookingModel.find({ packageId: packageId}).populate('packageId').populate('userId')
        const typedBooking: Booking[] = booking.map((book) => ({
            id: book.id,
            userId: book.userId as ObjectId,
            packageId: book.packageId as ObjectId,
            startDate: book.startDate,
            endDate: book.endDate,
            bookingDate: book.bookingDate,
            paymentSuccess: book.paymentSuccess,
            sessionId: book.sessionId,
            isCancelled: book.isCancelled,
            payment_intent: book.payment_intent,
            totalPrice: book.totalPrice,
            rating: book.rating

        }))
        return typedBooking
   }
    async cancel(bookingId: string): Promise<any> {
     try {
        const booking = await BookingModel.findOne({ _id: bookingId})
        if(booking) {
            await BookingModel.updateOne({_id:bookingId}, {$set: { isCancelled: true }})
            const paymentId = await BookingModel.findOne({ _id:bookingId}, { payment_intent: 1})
            return paymentId
        }
        return false
     } catch (error) {
        console.error(error);
        
     }
   }
    async cancelSubscription(providerId: string): Promise<any> {
    try {
        const provider = await ProviderModel.findOne({ _id: providerId})
        if (provider) {
            await ProviderModel.updateOne({ _id: providerId }, { $set: { isVerified: false }} , { upsert: true})
            const subscriptionId = await ProviderModel.findOne({ _id: providerId },{ subscriptionId: 1})
            return { subscriptionId }
        }
        return false
    } catch (error) {
        console.error(error);
        
    }
   }
    async findPackageBySession(sessionId: string): Promise<any> {
    try {
        const booking = await BookingModel.findOne({ sessionId: sessionId }).populate('userId').populate('packageId')
        if(booking) {
            const userId = booking.userId
            const packageId = booking.packageId
            const user = await UserModel.findOne({ _id:userId })
            const tourPackage = await PackageModel.findOne({ _id: packageId})
            return { booking, user, tourPackage }
        } else {
            return null
        }
    } catch (error) {
        console.error(error);
        
    }
   }
    async saveSubscription(subscriptionId: string, providerId: string): Promise<any> {
    try {
        const provider = await ProviderModel.findOne({ _id: providerId })
        if(provider) {
            await ProviderModel.updateOne({ _id: providerId }, { $set: { isVerified: true, subscriptionId: subscriptionId }})
            return true
        }
        return false
    } catch (error) {
        console.error(error);
        return false
    }
  }

}
export default bookingRepository