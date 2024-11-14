import Admin from "../../domain/admin";
import { AdminModel } from "../database/adminModel";
import { UserModel } from "../database/userModel";
import { CategoryModel } from "../database/categoryModel";
import { PackageModel } from "../database/packageModel";
import IAdminRepository from "../../useCase/interfaces/IAdminRepository";
import User from "../../domain/user";
import { ObjectId } from "mongoose";
import Category from "../../domain/category";
import Package from "../../domain/package";
import Provider from "../../domain/provider";
import { ProviderModel } from "../database/providerModel";
import Booking from "../../domain/booking";
import { BookingModel } from "../database/bookingModel";
import mongoose from "mongoose";
import { NotificationModel } from "../database/notificationModel";
import { log } from "console";

class adminRepository implements IAdminRepository {
    async findByEmail(email: string): Promise<Admin | null> {
        const adminExists = await AdminModel.findOne({email:email})
        if(adminExists) {
            return adminExists
        } else {
            return null
        }
    }
    async findUsers(): Promise<User[]> {
        const users: (User & {_id: ObjectId})[] = await UserModel.find()
        const typedUser: User[] = users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            isBlocked: user.isBlocked,
            image: user.image,
            phone: user.phone,
            createdAt: user.createdAt
        })) 
        return typedUser
    }
    async blockUser(id: string): Promise<boolean> {
        let user = await UserModel.findById(id)
        if(user) {
            await UserModel.findByIdAndUpdate(id, {$set: {isBlocked:!user.isBlocked}})
            return true
        }
        return false
    }
    async findProviders(): Promise<Provider[]> {
        const providers: (Provider & {_id: ObjectId})[] = await ProviderModel.find()
        const typedProvider: Provider[] = providers.map((provider) => ({
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
        })) 
        return typedProvider
    }
    async blockProvider(id: string): Promise<boolean> {
        let provider = await ProviderModel.findById(id)
        if(provider) {
            await ProviderModel.findByIdAndUpdate(id, { $set: { isBlocked: !provider.isBlocked}})
            return true
        }
        return false
    }
    async saveCategory(name: string, description: string): Promise<any> {
        try {
            const existingCategory = await CategoryModel.findOne({name:{$regex: new RegExp('^' + name + '$', 'i')}})
            if(existingCategory){
                return { duplicate: true, success: true }
            }
            const newCategory = new CategoryModel({name, description})
            await newCategory.save()
            return { duplicate: false, success: true}
        } catch (error) {
            console.error(error);
            return { duplicate: false, success: false}
            
        }
    }
    async findCategories(): Promise<Category[]> {
       
            const categories: (Category & { _id: ObjectId})[] = await CategoryModel.find()
            const typedCategory: Category[] = categories.map((category) => ({
                      id: category._id,
                      name: category.name,
                      description: category.description,
                      isHidden: category.isHidden
            }))
            return typedCategory
        
        }
        async getBooking(): Promise<Booking[]> {
            const booking: (Booking & { _id: ObjectId })[] = await BookingModel.find().populate('packageId').populate('userId').lean()
            const typedBooking: Booking[] = booking.map((book) => ({
                id: book._id as ObjectId,
                packageId: book.packageId as ObjectId,
                userId: book.userId as ObjectId,
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
            return typedBooking
        }
        async hideCategory(id: string): Promise<boolean> {
            let category = await CategoryModel.findById(id)
            if(category) {
                await CategoryModel.findByIdAndUpdate(id, { $set: { isHidden: !category.isHidden }})
                return true
            }
            return false
        }
        async editCategory(id: string, name: string, description: string): Promise<any> {
            const existingCategory = await CategoryModel.findOne({ name: { $regex: new RegExp('^' + name + '$', 'i') } })
            if(existingCategory) {
                return { duplicate: true, success: true }
            }
            let category = await CategoryModel.findById(id)
            if(category) {
                await CategoryModel.findByIdAndUpdate(id, { $set: { name: name, description: description}})
                return { duplicate: false, success: true }
            }
            return { duplicate: false, success: false}
        }
        async findPackages(): Promise<Package[]> {
            const packages: (Package & { _id: ObjectId })[] = await PackageModel.find();
        
            const typedPackage: Package[] = packages.map((pckg) => ({
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
        }
        async packageRequest(): Promise<Package[]> {
            const packages: (Package & { _id: ObjectId})[] = await PackageModel.find({ status: 'Verification required' })
            const typedPackages: Package[] = packages.map((pckg) => ({
                id: pckg._id,
                providerId: pckg.providerId as ObjectId,   
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
        }
        async changePackageStatus(id: string, status: string): Promise<boolean> {
            let tourPackage = await PackageModel.findById(id)
            if(tourPackage) {
                await PackageModel.findByIdAndUpdate(id, {$set: { status: status}})
                return true
            }
            return false
        }
        async hidePackage(id: string): Promise<boolean> {
            let tourPackage = await PackageModel.findById(id)
            if(tourPackage) {
                 await PackageModel.findByIdAndUpdate(id, { $set: { isBlocked: !tourPackage.isBlocked}})
                 return true
            }
            return false
        }
        async findCategory(categoryId: string): Promise<any> {
            try {
                let category = await CategoryModel.findOne({ _id: categoryId})
                if(category) {
                    return category
                }
                return false
            } catch (error) {
                console.error(error);
                return false
            }
        }
        async fetchBooking(filter: string): Promise<any> {
            try {
                let bookings
                if(filter.trim().length > 0) {
                    const tourPackage = await PackageModel.findOne({ title: filter})
                    if(tourPackage) {
                        bookings = await BookingModel.find({ packageId: tourPackage._id}).populate('packageId').populate('userId')
                        const typedBookings: Booking[] = bookings.map((booking: Booking) => ({
                            id: booking.id as ObjectId,
                            packageId: booking.packageId as ObjectId,
                            userId: booking.userId as ObjectId,
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            bookingDate: booking.bookingDate,
                            paymentSuccess: booking.paymentSuccess,
                            sessionId: booking.sessionId,
                            isCancelled: booking.isCancelled,
                            payment_intent: booking.payment_intent,
                            totalPrice: booking.totalPrice,
                            rating: booking.rating
                        }))
                        return typedBookings
                    } else {
                        bookings = await BookingModel.find().populate('packageId').populate('userId')
                        const typedBookings: Booking[] = bookings.map((booking: Booking) => ({
                            id: booking.id as ObjectId,
                            packageId: booking.packageId as ObjectId,
                            userId: booking.userId as ObjectId,
                            startDate: booking.startDate,
                            endDate: booking.endDate,
                            bookingDate: booking.bookingDate,
                            paymentSuccess: booking.paymentSuccess,
                            sessionId: booking.sessionId,
                            isCancelled: booking.isCancelled,
                            payment_intent: booking.payment_intent,
                            totalPrice: booking.totalPrice,
                            rating: booking.rating
                        }))
                        return typedBookings
                    }
                }
            } catch (error) {
                console.error(error);
                return false
            }
        }
        async dashboard(): Promise<any> {
            try {
                const totalUsers = await UserModel.countDocuments()
                const blockedUsers = await UserModel.countDocuments({ isBlocked: true })
                const totalProviders = await ProviderModel.countDocuments()
                const blockedProviders = await ProviderModel.countDocuments({ isBlocked: true})
                const totalPackages = await PackageModel.countDocuments()
                const rejectedPackages = await PackageModel.countDocuments({ status: 'Rejected' })
                return { totalUsers, totalPackages, totalProviders, rejectedPackages, blockedUsers, blockedProviders}
            } catch (error) {
                console.error(error);
                return false
            }
        }
        async getMonthlySales(): Promise<any> {
            try {
                const monthlySales = BookingModel.aggregate([
                    {
                        $group: {
                            _id: { $month: '$bookingDate' },
                            totalSales: { $sum: 1}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            month: '$_id',
                            totalSales: 1
                        }
                    }
                ])
                return monthlySales
            } catch (error) {
                console.error(error);
                return false
            }
        }
        async getMonthlyRevenue(): Promise<any> {
            try {
                const monthlyRevenue = await BookingModel.aggregate([
                    {
                        $match: { paymentSuccess: true, isCancelled: false}
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
                ])
                return monthlyRevenue
            } catch (error) {
                console.error(error);
                return false
            }
        }
        async addNotification(providerId: string, notification: string, id: string): Promise<any> {
            try {
                const newNotification = new NotificationModel({
                    providerId: providerId,
                    packageId: id,
                    notification: notification,
                    creationTime: Date.now()
                })
                await newNotification.save()
                return newNotification
            } catch (error) {
                console.error(error);
                return false
            }
        }
        
}
export default adminRepository
