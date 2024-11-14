import User from "../../domain/user";
import { UserModel } from '../database/userModel'
import IUserRepository from "../../useCase/interfaces/IUserRepository";
import Package from "../../domain/package";
import { PackageModel } from "../database/packageModel";
import { title } from "process";
import { RatingModel } from "../database/ratingModel";
import { BookingModel } from "../database/bookingModel";
import Rating from "../../domain/rating";
import Provider from "../../domain/provider";
import { ProviderModel } from "../database/providerModel";

class UserRepository implements IUserRepository {
    async findByEmail(email: string) {
        try {
            const buyerExists = await UserModel.findOne({ email })
            if(buyerExists) {
                return buyerExists
            } else {
                return null
            }
        } catch (error) {
            console.log(error);
            return null
            
        }
    }
  async findUserById(id: string): Promise<User | null> {
    try {
        let userData:User | null = await UserModel.findById(id)
        return userData
    } catch (error) {
        console.log(error);
        return null
    }
  }
  async saveUser(user: User){
    try {
        const newUser = new UserModel(user) 
        await newUser.save()
        return newUser
    } catch (error) {
        console.log(error);
        return null
        
    }
      
  }
  async resetPassword(email: string, hashedPassword: string): Promise<any> {
      try {
        let updatePassword = await UserModel.updateOne({ email }, { password: hashedPassword })
        if(updatePassword) {
            return true
        }
        return false
      } catch (error) {
        console.error(error);
        return null
      }
  }
  async updateUser(id: string, user: User): Promise<any> {
      try {
        let updateUser = await UserModel.updateOne({ _id: id}, user,{ new: true })
        return updateUser.acknowledged
      } catch (error) {
        console.error(error);
        return null
      }
  }
  async findPackageId(packageId: string): Promise<Package | null> {
      try {
        let packageData: Package | null = await PackageModel.findById(packageId)
        return packageData
      } catch (error) {
        console.error(error);
        return null
      }
  }
  async fetchPackage(searchTerm: string, sortOption: string, selectedCategory: string, page: number, limit: number): Promise<any> {
      try {
        
        
        let query: any = { status: 'Accepted' }
        if(searchTerm) {
            query.$or = [
                { title: { $regex: searchTerm, $options: 'i' }},
                { address: { $regex: searchTerm, $options: 'i'}}
            ]
        }
        if(selectedCategory) {
            query.category = selectedCategory
        }
        let sort: any = {}
        if(sortOption === 'Low to High') {
            sort = { price: 1}
        } else if(sortOption === 'High to Low') {
            sort  = { price: -1}
        } else if(sortOption === 'Sort') {
            sort = { price: 1}
        }
        const packages: any = await PackageModel
        .find(query)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('providerId')
        .exec()
        const typedPackage: Package[] = packages.map((pkg: Package) => ({
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
          const total = await PackageModel.find()
          let totalLength
          if(total) {
            totalLength = total.length
          }
          return { typedPackage, totalLength }
      } catch (error) {
        console.error(error);
        return false
      }
  }
  async rate(bookingId: string, rating: number, review: string, userId: string): Promise<any> {
      try {
        const newRate = new RatingModel({ bookingId: bookingId, rating: rating, review: review, userId: userId })
        await newRate.save()
        const booking = await BookingModel.updateOne({ _id: bookingId }, { rating: true })
        return newRate
      } catch (error) {
        console.error(error);
        return false
      }
  }
  async editRate(bookingId: string, rating: number, review: string, userId: string): Promise<any> {
      try {
        const ratings = await RatingModel.updateOne({ bookingId: bookingId }, { $set: { rating: rating, review: review}})
        if(ratings) {
            return true
        }
        return false
      } catch (error) {
        console.error(error);
        return false
      }
  }
  async getRate(packageId: string): Promise<any> {
      try {
        console.log('packageId in repo:', packageId);
        
        const bookings = await BookingModel.find({ packageId })
        const bookingIds = bookings.map(booking => booking._id)
        const ratings = await RatingModel.find({ bookingId: { $in: bookingIds }}).populate('userId').populate('bookingId')
        const typedRatings: Rating[] = ratings.map((rate: Rating) => ({
            id: rate.id,
            bookingId: rate.bookingId,
            userId: rate.userId,
            rating: rate.rating,
            review: rate.review,
            reply: rate.reply
        }))
        return typedRatings
      } catch (error) {
        console.error(error);
        return false
      }
  }
  async getProvider(providerId: string): Promise<any> {
      try {
        if(providerId) {
            const provider: Provider | null = await ProviderModel.findOne({ _id: providerId})
            if(provider) {
                return provider
            }
            return false
        }
        return false
      } catch (error) {
        console.error(error);
        
      }
  }
  async getRateById(bookingId: string): Promise<any> {
      try {
        const findRating = await RatingModel.findOne({ bookingId: bookingId})
        if(findRating) {
            return findRating
        }
        return false
      } catch (error) {
        console.error(error);
        return false
      }
  }
  async getBookingDetails(bookingId: string): Promise<any> {
      try {
        const findBooking = await BookingModel.findOne({ _id: bookingId }).populate('userId').populate('packageId')
        if(findBooking) {
            return findBooking
        } else {
            return false
        }
      } catch (error) {
        console.error(error);
        return false
      }
  }
}
export default UserRepository