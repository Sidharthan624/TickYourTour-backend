import Admin from "../domain/admin";
import IAdminRepository from "./interfaces/IAdminRepository";
import hashPassword from "../infrastructure/utils/hashPassword";
import JwtToken from "../infrastructure/utils/JWTtoken";

class adminUseCase {
    private iAdminRepository: IAdminRepository;
    private hashPassword: hashPassword;
    private JWTtoken: JwtToken
    constructor(
        iAdminRepository: IAdminRepository,
        hashPassword: hashPassword,
        JWTtoken: JwtToken
    ) {
        this.iAdminRepository = iAdminRepository;
        this.hashPassword = hashPassword;
        this.JWTtoken = JWTtoken
    }
    async adminLogin(email: string, password: string) {
        try {
            const adminFound: any = await this.iAdminRepository.findByEmail(email)
            if(adminFound) {
                const passwordMatch = await this.hashPassword.compare(password, adminFound.password)
                if(passwordMatch) {
                    const token = this.JWTtoken.createJwt(adminFound._id, 'admin')
                    return { success: true, adminData: adminFound, token}
                } else {
                    return { success: false, message: 'Invalid credentials'}
                }
            } else {
                return { success: false, message: 'Invalid credentials'}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getUsers() {
        try {
            const users = await this.iAdminRepository.findUsers()
            if(users) {
                return users
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async blockUser(id: string) {
        try {
            let blocked = await this.iAdminRepository.blockUser(id)
            return blocked
        } catch (error) {
            console.error(error);
            
        }
    }
    async getProviders() {
        try {
            const providers = await this.iAdminRepository.findProviders()
            if(providers) {
                return providers
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async blockProvider(id: string) {
        try {
            let blocked = await this.iAdminRepository.blockProvider(id)
            return blocked
        } catch (error) {
            console.error(error);
            
        }
    }
    async addCategory(name: string, description: string) {
        try {
            let saveCategory = await this.iAdminRepository.saveCategory(name, description)
            return saveCategory
        } catch (error) {
            console.error(error);
            
        }
    }
    async getCategory() {
        try {
            const categories = await this.iAdminRepository.findCategories()
            if(categories) {
                return categories
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async hideCategory(id: string) {
        try {
            let hide = await this.iAdminRepository.hideCategory(id)
            return hide
        } catch (error) {
            console.error(error);
            
        }
    }
    async editCategory(id: string, name: string, description: string) {
        try {
           let edit = await this.iAdminRepository.editCategory(id, name, description)
           return edit
        } catch (error) {
            console.error(error);
            
        }
    }
    async getProperty() {
        try {
           const packages = await this.iAdminRepository.findPackages()
           if(packages) {
            return packages
           }
           return null

        } catch (error) {
            console.error(error);
            
        }
    }
    async propertyRequest() {
        try {
            const packages = await this.iAdminRepository.packageRequest()
            if(packages) {
                return packages
            }
            return null
        } catch (error) {
            console.error(error);
            
        }
    }
    async changeStatus(id: string, status: string) {
        try {
            const statusChange = await this.iAdminRepository.changePackageStatus(id, status)
            return statusChange 
        } catch (error) {
            console.error(error);
            
        }
    }
    async hidePackage(id:string) {
        try {
            let hide = await this.iAdminRepository.hidePackage(id)
            return hide
        } catch (error) {
            console.error(error);
            
        }
    }
    async findCategory(categoryId: string) {
        try {
            const category = await this.iAdminRepository.findCategory(categoryId)
            if(category) {
                return {success: true, category: category}
            }
            return { success: false}
        } catch (error) {
            console.error(error);
            
        }
    }
    async getBooking() {
        try {
            const booking = await this.iAdminRepository.getBooking()
            if(booking) {
                return { success: true, data: booking}
            }
            return { success: false}
        } catch (error) {
            console.error(error);
            
        }
    }
    async fetchBooking(filter: string) {
        try {
            const fetch = await this.iAdminRepository.fetchBooking(filter)
            if(fetch) {
              return { success: true, booking: fetch}
            }
            return { success: false}
        } catch (error) {
            console.error(error);
            
        }
    }
    async dashboard() {
        try {
            const dashboard = await this.iAdminRepository.dashboard()
            if(dashboard) {
                return { success: true, dashboard}
            } else if(!dashboard) {
                return { success: false}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getMonthlySales() {
        try {
            const monthlySale = await this.iAdminRepository.getMonthlySales() 
                if(monthlySale) {
                  return { success: true, monthlySale}
                } else if(!monthlySale) {
                    return { success: false}
                }
            
        } catch (error) {
            console.error(error);
            
        }
    }
    async getMonthlyRevenue() {
        try {
            const monthlyRevenue = await this.iAdminRepository.getMonthlyRevenue()
            if(monthlyRevenue) {
                return { success: true, monthlyRevenue}
            } else if(!monthlyRevenue) {
                return { success: false}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async addNotification(providerId: string, status: string, id: string) {
        try {
            let notification
            if(status == 'Accepted') {
                notification = 'Your package has been approved...'
            } else if(status == 'Rejected') {
                notification = 'Your package has been rejected...'
            }
            if(notification) {
                const addNotification = await this.iAdminRepository.addNotification(providerId, notification,id)
                if(addNotification) {
                    return { success: true}
                } else if(!addNotification) {
                    return { success: false}
                }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
}
export default adminUseCase