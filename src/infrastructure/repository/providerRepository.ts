import Provider from "../../domain/provider";
import { ProviderModel } from "../database/providerModel";
import { PackageModel } from "../database/packageModel";
import { UserModel } from "../database/userModel";
import { BookingModel } from "../database/bookingModel";
import { RatingModel } from "../database/ratingModel";
import Notification from "../../domain/notification";
import IProviderRepository from "../../useCase/interfaces/IProviderRepository";
import Package from "../../domain/package";
import { NotificationModel } from "../database/notificationModel";


class providerRepository implements IProviderRepository {
    async findByEmail(email: string)  {
        try {
            const providerExists = await ProviderModel.findOne({email: email})
            if(providerExists) {
                return providerExists
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            return null
            
        }
    }
    async saveProvider(provider: Provider): Promise<Provider | null> {
        try {
            const newProvider = new ProviderModel(provider)
            await newProvider.save()
            return newProvider
        } catch (error) {
            console.error(error);
            return null
            
        }
    }
    async findUserById(id: string): Promise<Provider | null> {
        try {
            let providerData: Provider | null = await ProviderModel.findById(id)
            return providerData
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async addPackage(packageInfo: Package, providerId: string): Promise<Package |  null> {
        try {
            let newPackage = new PackageModel(packageInfo)
            await newPackage.save()
            return newPackage
        } catch (error) {
            console.error(error);
            return null
        }
    }
   async getPackageByProviderId(providerId: string): Promise<Package[] | null> {
        try {
            let tourPackage = await PackageModel.find({providerId:providerId})
            if(tourPackage) {
                return tourPackage
            } else {
                return null
            }
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async editPackage(packageInfo: Package): Promise<any> {
        try {
            let updatedPackage = await PackageModel.updateOne({_id:packageInfo.id}, {
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
            })
            return updatedPackage
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async updateProvider(providerId: string, providerInfo: Provider): Promise<any> {
        try {
            let updateProvider = await ProviderModel.updateOne({_id: providerId},providerInfo, { new : true})
            return updateProvider.acknowledged
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async getUser(userId: string): Promise<any> {
        try {
            let userFound = await UserModel.findOne({_id:userId})
            return userFound
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async dashboard(providerId: string): Promise<any> {
        try {
            const totalPackages = await PackageModel.countDocuments({providerId: providerId})
            const acceptedPackages = await PackageModel.countDocuments({ providerId: providerId, status: "Accepted"})
            const rejectedPackages = await PackageModel.countDocuments({providerId: providerId, status: "Rejected"})
            return { totalPackages, rejectedPackages, acceptedPackages}
        } catch (error) {
            console.error(error);
            return null
            
        }
    }
    async  getMonthlySales(providerId: string): Promise<any> {
        try {
            let packageId
            let tourPackage = await PackageModel.findOne({ providerId: providerId})
            if(tourPackage) {
                packageId = tourPackage._id
                const monthlySale = await BookingModel.aggregate([
                    {
                        $match: {
                      packageId: packageId,
                      paymentSuccess: true,
                      isCancelled: false
                    }
                },
                {
                    $project: {
                        month: { $month: '$BookingDate'},
                        totalprice: 1
                    }
                },
                {
                    $group: {
                        _id: '$month',
                        totalSales: { $sum: 1}
                    }
                },
                {
                    $project: {
                        month: "$_id",
                        totalSales: 1,
                        _id: 0
                    }
                }
                ])
                return monthlySale
            }
            return false
        } catch (error) {
            console.error(error);
            return null
        }
    }
    async getMonthlyRevenue(providerId: string): Promise<any> {
         try {
            let packageIds = []
            let packages = await PackageModel.find({providerId: providerId})
            if(packages.length > 0) {
                packageIds = packages.map(tourPackage => tourPackage._id)
                const monthlyRevenue = await BookingModel.aggregate([
                    {
                    $match: {
                       packageId: { $in: packageIds},
                       paymentSuccess: true,
                       isCancelled: false
                    }
                },
                {
                    $project: {
                        month: {$month: '$bookingDate'},
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
            ])
            return monthlyRevenue
            }
            return false
         } catch (error) {
            console.error(error);
            return false
            
         }
    }
    async addReply(reviewId: string, reply: string): Promise<any> {
        try {
            let rating = await RatingModel.findOne({_id: reviewId})
            if(rating) {
                let addReply = await RatingModel.updateOne({ _id: reviewId}, { reply: reply})
                return addReply.acknowledged
            }
            return false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    async findPackage(packageId: string): Promise<any> {
        try {
            const tourPackage = await PackageModel.findById(packageId)
            if(tourPackage) {
                return tourPackage
            }
            return false
        } catch (error) {
            console.error(error);
            return false
            
        }
    }
    async getNotification(providerId: string): Promise<any> {
        try {
            const notification: Notification[] = await NotificationModel.find({providerId: providerId}).populate('packageId')
            const typedNotification: Notification[] = notification.map((notif) => ({
                id: notif._id,
                providerId: notif.providerId,
                packageId: notif.packageId,
                creationTime: notif.creationTime,
                notification: notif.notification
            }))
            return typedNotification
        } catch (error) {
            console.error(error);
            return null
        }
    }
}
export default providerRepository