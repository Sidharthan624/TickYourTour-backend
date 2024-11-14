import Provider from "../domain/provider";
import Package from "../domain/package";
import IProviderRepository from "./interfaces/IProviderRepository";
import otpGenerate from "../infrastructure/utils/generateOTP";
import sendMail from "../infrastructure/utils/sendEmail";
import JwtToken from "../infrastructure/utils/JWTtoken";
import hashPassword from "../infrastructure/utils/hashPassword";
import Cloudinary from "../infrastructure/utils/cloudinary";
import mongoose, { ObjectId } from "mongoose";
import jwt from 'jsonwebtoken'

class providerUseCase {
    private iProviderRepository: IProviderRepository;
    private otpGenerate: otpGenerate;
    private sendMail: sendMail;
    private JWTtoken: JwtToken;
    private hashPassword: hashPassword;
    private Cloudinary: Cloudinary;
    constructor(
        iProviderRepository: IProviderRepository,
        otpGenerate: otpGenerate,
        sendMail: sendMail,
        JWTtoken: JwtToken,
        hashPassword: hashPassword,
        Cloudinary: Cloudinary
    ) {
        this.iProviderRepository = iProviderRepository;
        this.Cloudinary = Cloudinary;
        this.JWTtoken = JWTtoken;
        this.hashPassword = hashPassword;
        this.otpGenerate = otpGenerate;
        this.sendMail = sendMail
    }
    async findProvider(providerInfo: Provider) {
        try {
            const providerFound = await this.iProviderRepository.findByEmail(providerInfo.email)
            if (providerFound) {
                return {
                    status: 200,
                    data: {
                        data: true,
                        providerFound
                    }
                }
            } else {
                const otp = await this.otpGenerate.generateOtp(4)
                console.log(`Otp sent: ${otp}`);
                let token = jwt.sign(
                    {
                    providerInfo, otp
                },
                    process.env.JWT_SECRET as string,
                    { expiresIn: '5m' }
                )
                const mail =  this.sendMail.sendMail(
                    providerInfo.name,
                    providerInfo.email,
                    otp
                )
                return {
                    status: 200,
                    data: {
                        data: false,
                        token: token
                    }
                }

            }
        } catch (error) {
            console.error(error);

        }
    }
    async saveProvider(token: string, providerOtp: string) {
        try {
            let decodedToken = this.JWTtoken.verifyJwt(token)
            if(decodedToken) {
                if(providerOtp === decodedToken.otp) {
                    const hashedPassword = await this.hashPassword.createHash(decodedToken.providerInfo.password)
                    decodedToken.providerInfo.password = hashedPassword
                    const providerSave = await this.iProviderRepository.saveProvider(decodedToken.providerInfo)
                    if(providerSave) {
                        let createdToken = this.JWTtoken.createJwt(providerSave._id as string, 'provider')
                        return { success: true, token: createdToken}
                    } else {
                        return { success: false, message:" Internal server error!"}
                    }
                } else {
                    return {success: false,message: "Incorrect otp"}
                }
            } else {
                return { success: false, message: "Not token! try again"}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async providerLogin(email: string, password: string) {
        try {
            const providerFound: any = await this.iProviderRepository.findByEmail(email) 
                if(providerFound) {
                     let passwordMatch = await this.hashPassword.compare(password, providerFound.password)
                     if(!passwordMatch) {
                        return { success: false, message: "Incorrect Password"}
                     } else if(providerFound.isBlocked) {
                        return {success: false, message:"Provider has been blocked by admin!!"}
                     } else {
                        let token = this.JWTtoken.createJwt(providerFound._id,'provider')
                        return {success: true, token: token}
                     }
                } else {
                    return { success: false, message: "Email not found"}
                }
            } catch (error) {
            console.error(error);
            
        }
    }
    async providerGetProfile(providerId: string) {
        try {
           const provider = await this.iProviderRepository.findUserById(providerId)
           return provider 
        } catch (error) {
            console.error(error);
            
        }
    }
    async updateProfile(providerId: string, providerInfo: Provider) {
        try {
            let providerExists = await this.iProviderRepository.findUserById(providerId)
            if(providerExists) {
                let uploadImage = await this.Cloudinary.saveToCloudinary(providerInfo.image)
                providerInfo.image = uploadImage
                let res = await this.iProviderRepository.updateProvider(providerId, providerInfo)
                return res
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async createPackage(providerId: string, packageInfo:Package) {
        try {
            let providerExists = await this.iProviderRepository.findUserById(providerId)
            if(providerExists) {
                const uploadImages = await Promise.all(packageInfo.photos.map(async (file: any) => {
                    return await this.Cloudinary.saveToCloudinary(file.path)
                }))
                packageInfo.photos = uploadImages
                const mongooseProviderId = (providerId as unknown) as mongoose.Schema.Types.ObjectId
                packageInfo.providerId = mongooseProviderId
                const addPackage = await this.iProviderRepository.addPackage(packageInfo, providerId)
                if(addPackage) {
                    return true
                } else {
                    return false
                }

            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async editPackage(packageInfo: Package, providerId: string) {
        try {
            console.log(packageInfo);
            
            let providerExists = await this.iProviderRepository.findUserById(providerId)
            if(providerExists) {
                const uploadImages = await Promise.all(
                    packageInfo.photos.map(async (file: any) => {
                        return await this.Cloudinary.saveToCloudinary(file.path)
                    })
                )
                packageInfo.photos = uploadImages
                const update = await this.iProviderRepository.editPackage(packageInfo)
                if(update) {
                    return true
                } else {
                    return false
                }
                    
                
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getPackage(providerid: string) {
        try {
            let providerExists = await this.iProviderRepository.findUserById(providerid)
            if(providerExists) {
                const getPackage = await this.iProviderRepository.getPackageByProviderId(providerid)
                if(getPackage) {
                    return getPackage
                } else {
                    return false
                }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getUser(userId: string) {
       try {
        let userFound = await this.iProviderRepository.getUser(userId)
        if(userFound) {
            return { success: true, data: userFound}
        } else {
            return {success: false}
        }
       } catch (error) {
        console.error(error);
        
       }
    }
    async dashBoard(providerId: string) {
        try {
            let dashBoard = await this.iProviderRepository.dashboard(providerId)
            if(dashBoard) {
                return {success: true, dashBoard}
        } else {
            return {success: false}
        }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getMonthlySales(providerId: string) {
        try {
            let getMonthlySales = await this.iProviderRepository.getMonthlySales(providerId)
            if(getMonthlySales) {
                return {success: true, getMonthlySales}
            } else {
                return {success: false}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getMonthlyRevenue(providerId: string) {
        try {
            let getMonthlyRevenue = await this.iProviderRepository.getMonthlyRevenue(providerId)
            if(getMonthlyRevenue) {
                return { success: true, getMonthlyRevenue}
            } else if(!getMonthlyRevenue) {
                return { success: false}
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async addReply(reviewId: string, reply: string) {
        try {
            let addReply = await this.iProviderRepository.addReply(reviewId,reply)
            if(addReply) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async findPackage(packageId:string) {
        try {
            let tourPackage = await this.iProviderRepository.findPackage(packageId)
            if(tourPackage) {
                return { success: true, tourPackage}
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getNotification(providerId: string) {
        try {
            const notification = await this.iProviderRepository.getNotification(providerId)
            if(notification) {
                return { success: true, notification}
            } else {
                return {success: false}
           }
        } catch (error) {
            console.error(error);
            
        }
    }
    
}
export default providerUseCase