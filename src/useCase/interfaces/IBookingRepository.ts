import Booking from "../../domain/booking";
import Package from "../../domain/package";

interface IBookingRepository {
    newBooking(data: Booking): Promise<Booking | null>,
    getBooking(bookingId: string): Promise<Booking | null>,
    findPackageById(packageId: string): Promise<Package | null>,
    saveSession(sessionId: string, bookingId: string): Promise<any>,
    updatePayment(sessionId: string, paymentId: string): Promise<any>,
    updateProvider(subscriptionId: string): Promise<any>,
    getBookings(userId: string, page: number, limit: number): Promise<any>,
    getBookingByProvider(providerId: string): Promise<Booking[]>,
    cancel(bookingId: string): Promise<any>,
    cancelSubscription(providerId: string): Promise<any>,
    findPackageBySession(sessionId: string): Promise<any>,
    saveAmount(sessionId: string, totalPrice: number): Promise<any>,
    saveSubscription(subscriptionId: string, providerId: string): Promise<any> 
}
export default IBookingRepository