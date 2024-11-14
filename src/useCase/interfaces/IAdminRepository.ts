import Admin from "../../domain/admin";
import User from "../../domain/user";
import Package from "../../domain/package";
import Booking from "../../domain/booking";
import Provider from "../../domain/provider";
import Category from "../../domain/category";

interface IAdminRepository {
    findByEmail(email: string): Promise<Admin | null>,
    findUsers(): Promise<User[]>,
    blockUser(id: string): Promise<boolean>,
    findProviders(): Promise<Provider[]>,
    blockProvider(id: string): Promise<boolean>,
    saveCategory(name: string, description: string): Promise<any>
    findCategories(): Promise<Category[]>,
    hideCategory(id: string): Promise<boolean>,
    editCategory(id: string, name: string, description: string): Promise<any>,
    findPackages(): Promise<Package[]>,
    packageRequest(): Promise<Package[]>,
    changePackageStatus(id: string, status: string): Promise<boolean>,
    hidePackage(id: string): Promise<boolean>,
    findCategory(categoryId: string): Promise<any>,
    getBooking(): Promise<Booking[]>,
    fetchBooking(filter: string): Promise<any>,
    dashboard(): Promise<any>,
    getMonthlySales(): Promise<any>,
    getMonthlyRevenue(): Promise<any>,
    addNotification(providerId: string, notification: string, id: string): Promise<any> 

}
export default IAdminRepository