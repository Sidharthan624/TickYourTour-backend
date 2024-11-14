import Provider from '../../domain/provider'
import Package from '../../domain/package'
 interface IProviderRepository {
    findByEmail (email: string): Promise<Provider| null>,
    saveProvider(provider: Provider): Promise<Provider | null>,
    findUserById(id: string): Promise<Provider | null>,
    addPackage(packageInfo: Package, providerId:string): Promise<Package  | null>,
    getPackageByProviderId(providerId: string): Promise<Package[] | null>,
    editPackage(packageInfo: Package): Promise<Package | null>,
    updateProvider(providerId: string, providerInfo: Provider): Promise<any>,
    getUser(userId: string): Promise<any>,
    dashboard(providerId: string): Promise<any>,
    getMonthlySales(providerId: string): Promise<any>,
    getMonthlyRevenue(providerId: string): Promise<any>,
    addReply(reviewId: string, reply: string): Promise<any>,
    findPackage(packageId: string): Promise<any>,
    getNotification(providerId: string): Promise<any>

 }
export default IProviderRepository
