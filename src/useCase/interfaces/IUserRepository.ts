import User from '../../domain/user'
import Package from '../../domain/package'

interface IUserRepository {
    findByEmail(email: string) : Promise<User | null>,
    saveUser(user : User ) : Promise<User | null>,
    findUserById(id : string ) : Promise<User |null>,
    updateUser(id: string, user: User): Promise<any>,
    findPackageId(packageId: string): Promise<Package | null>,
    resetPassword(email: string, hashedPassword: string): Promise<any>,
    fetchPackage(searchTerm: string, sortOption: string, selectedCategory: string, page: number, limit: number): Promise<any>,
    rate(bookingId: string, rating: number, review: string, userId: string): Promise<any>,
    getRate(packageId: string): Promise<any>,
    getProvider(providerId: string): Promise<any>,
    getRateById(bookingId: string): Promise<any>,
    editRate(bookingId: string, rating: number, review: string, userId: string): Promise<any>,
    getBookingDetails(bookingId: string): Promise<any>



}
export default IUserRepository