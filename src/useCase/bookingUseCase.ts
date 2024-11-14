import Booking from "../domain/booking";
import IBookingRepository from "./interfaces/IBookingRepository";
import StripePayment from "../infrastructure/utils/stripe";
import sendMail from "../infrastructure/utils/sendEmail";
import mongoose from "mongoose";
class bookingUseCase {
    private iBookingRepository: IBookingRepository
    private stripePayment: StripePayment
    private sendMail: sendMail

    constructor(
        iBookingRepository: IBookingRepository,
        stripePayment: StripePayment,
        sendMail: sendMail

    ) {
        this.iBookingRepository = iBookingRepository,
        this.stripePayment = stripePayment,
        this.sendMail = sendMail
    }
    async newBooking(data: Booking) {
        try {
            const newBooking = await this.iBookingRepository.newBooking(data)
            if(newBooking) {
                return { success: true, data: newBooking }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getBooking(bookingId: string) {
        try {
            const getBooking = await this.iBookingRepository.getBooking(bookingId)
            return getBooking
        } catch (error) {
            console.error(error);
            
        }
    }
    async proceedForPayment(bookingDetails: Booking) {
        try {
            const packageId = bookingDetails.packageId.toString()
            let packagePrice
            const packageFound = await this.iBookingRepository.findPackageById(packageId)
            if(packageFound) {
                packagePrice = packageFound.price
                const payment = await this.stripePayment.makePayment(packagePrice)
                return payment
            }
            
        } catch (error) {
            console.error(error);
            
        }
    }
    async proceedForSubscription(providerId: string) {
        const payment = await this.stripePayment.makeSubscription(providerId)
        return payment
    }
    async saveSession(sessionId: string, bookingId: string) {
        try {
            const save = await this.iBookingRepository.saveSession(sessionId, bookingId)
            if(save) {
                return { success: true }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async updatePaymentStatus(sessionId: string, paymentId: string) {
        try {
            const updatePayment = await this.iBookingRepository.updatePayment(sessionId, paymentId)
            if(updatePayment) {
                return { success: true }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async updateProvider(subscriptionId: string) {
        try {
            const updateProvider = await this.iBookingRepository.updateProvider(subscriptionId)
            if(updateProvider) {
                return { success: true }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getBookings(userId: string, page: number, limit: number) {
        try {
            const getBookings = await this.iBookingRepository.getBookings(userId, page, limit)
            if(getBookings) {
                return { success: true , bookings: getBookings.typedBook, length: getBookings.totalLength}
            } else if(!getBookings) {
                return { success: false }
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async getBookingByProvider(providerId: string) {
        try {
            const getBooking = await this.iBookingRepository.getBookingByProvider(providerId)
            if(getBooking) {
                return getBooking
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async cancel(bookingId: string) {
        try {
            const cancel = await this.iBookingRepository.cancel(bookingId)
            if(cancel) {
                const refund = await this.stripePayment.refundPayment(cancel.paymentId.payment_intent)
                if(refund) {
                    return { success: false}
                }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async cancelSubscription(providerId: string) {
        try {
            const cancel = await this.iBookingRepository.cancelSubscription(providerId)
            if(cancel) {
                const cancelSubscription = await this.stripePayment.cancelSubscription(cancel.subscriptionId.subscriptionId)
                if(cancelSubscription) {
                    return { success: true }
                } else if(!cancelSubscription) {
                    return { success: false }
                }
            }
            return { success:false }
        } catch (error) {
            console.error(error);
            
        }
    }
    async sendConfirmationMail(sessionId: string) {
        try {
            const findUser = await this.iBookingRepository.findPackageBySession(sessionId)
            const name = findUser.user.name
            const email = findUser.user.email
            const price = findUser.tourPackage.price
            const startDate = findUser.booking.startDate
            const endDate = findUser.booking.endDate
            const formatDate = (startDateString: string, endDateString: string) => {
                const startDate = new Date(startDateString)
                const endDate = new Date(endDateString)
                const startDay = startDate.getDate()
                const startMonth = startDate.getMonth() + 1
                const startYear = startDate.getFullYear() % 100
                const formattedStartDate = `${String(startDay).padStart(2, '0')}/${String(startMonth).padStart(2, '0')}/${startYear}`
                const endDay = endDate.getDate()
                const endMonth = endDate.getMonth() + 1
                const endYear = endDate.getFullYear() % 100
                const formattedEndDate = `${String(endDay).padStart(2, '0')}/${String(endMonth).padStart(2, '0')}/${endYear}`
                return {
                    startDateFormatted: formattedStartDate,
                    endDateFormatted: formattedEndDate
                }
                
            }
            const { startDateFormatted, endDateFormatted } = formatDate(startDate, endDate)
            const saveAmount = await this.iBookingRepository.saveAmount(sessionId,price)
            const mail =  this.sendMail.sendConfirmationMail(email, name, startDateFormatted, endDateFormatted, price)
            return { success: true }
        } catch (error) {
            console.error(error);
            
        }
    }
    async saveSubscription(subscriptionId: string, providerId: string) {
        try {
            const saveSubscription = await this.iBookingRepository.saveSubscription(subscriptionId, providerId)
            if(saveSubscription) {
                return { success: true }
              } else if(!saveSubscription) {
                return { success: false }
              }
        } catch (error) {
            console.error(error);
            
        }
    }
}
export default bookingUseCase