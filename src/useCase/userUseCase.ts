import User from "../domain/user";
import IUserRepository from "./interfaces/IUserRepository";
import hashPassword from "../infrastructure/utils/hashPassword";
import JwtToken from "../infrastructure/utils/JWTtoken";
import otpGenerate from "../infrastructure/utils/generateOTP";
import sendMail from "../infrastructure/utils/sendEmail";
import jwt from 'jsonwebtoken'
import Cloudinary from "../infrastructure/utils/cloudinary";

class userUseCase {
    private iUserRepository: IUserRepository
    private hashPassword: hashPassword
    private otpGenerate: otpGenerate
    private jwtToken: JwtToken
    private sendMail: sendMail
    private cloudinary: Cloudinary
    constructor(
    iUserRepository: IUserRepository,
     hashPassword: hashPassword,
     otpGenerate: otpGenerate,
     jwtToken: JwtToken,
     sendMail: sendMail,
     Cloudinary: Cloudinary
    ) {
        this.hashPassword = hashPassword
        this.iUserRepository = iUserRepository
        this.jwtToken = jwtToken
        this.otpGenerate = otpGenerate
        this.sendMail = sendMail,
        this.cloudinary = Cloudinary

    }
    async findUser(userInfo: User) {
        try {
            const userFound = await this.iUserRepository.findByEmail(userInfo.email)
            if(userFound) {
                return {
                    status: 200,
                    data: {
                        data: true,
                        userFound
                    }
                }
            } else {
                const otp = await  this.otpGenerate.generateOtp(4)
                console.log(`OTP: ${otp}`);
                const token = jwt.sign({userInfo, otp}, process.env.JWT_SECRET as string, {expiresIn: "5min"} )
                

                const mail =  this.sendMail.sendMail(userInfo.name, userInfo.email, otp)
                return {
                    status: 200,
                    data:{
                        data: false,
                        token
                    }
                }
                
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async saveUser(token: string, userOtp: string ) {
        try {
            

            let decodedToken = this.jwtToken.verifyJwt(token)
            console.log('Decoded Token:', decodedToken);

            if (decodedToken) {
                if(userOtp === decodedToken.otp){
                    const hashedPassword = await this.hashPassword.createHash(decodedToken.userInfo.password)
                    decodedToken.userInfo.password = hashedPassword
                    const userSave = await this.iUserRepository.saveUser(decodedToken.userInfo)
                    if(userSave) {
                        const createdToken = this.jwtToken.createJwt(userSave._id as string, "user" )
                        return {
                            success:true, token: createdToken
                        }
    
                    } else {
                        return { success:false, message: "Internal server error"}
                    }

                }else {
                    return { success: false, message: "Invalid token!"}
                }
               
                
            } else {
                return {
                    success:false,message: "No token!, try again"
                }
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async userLogin(email: string, password: string) {
        try {
            const userFound: any = await this.iUserRepository.findByEmail(email)
            if(userFound) {
                const passwordMatch = await this.hashPassword.compare(password, userFound.password)
                if(!passwordMatch) {
                    return { success: false, message:"Incorrect password"}
                } else if(userFound.isBlocked) {
                    return { success: false, message:"This account has been blocked"}
                } else {
                    const token = this.jwtToken.createJwt(userFound._id, "user")
                    return {success: true, token}
                }


            } else {
                return { success: false, message:"Email not found"}
            }

        } catch (error) {
            console.log(error);
            
        }
    }
    async gSignUp(email:string, name:string, password:string) {
        try {
            const userFound = await  this.iUserRepository.findByEmail(email)
            if(userFound) {
                return {status:200, data: false}
            } else {
                const hashedPassword = await this.hashPassword.createHash(password)
                const userSave = await this.iUserRepository.saveUser({
                    name, email, password:hashedPassword
                } as User)
                return { status: 200, data: userSave}
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async findUserByEmail(email: string) {
        try {
            const findUser = await this.iUserRepository.findByEmail(email)
            if(findUser) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            
        }
    }
    async forgotPassword(email: string) {
        try {
            const userFound = await this.iUserRepository.findByEmail(email)
            if(userFound) {
                const otp = await this.otpGenerate.generateOtp(4)
                let token = jwt.sign(
                    { userFound, otp}, process.env.JWT_SECRET as string, 
                    { expiresIn: '5m' }
                )
                const mail = await this.sendMail.sendMail(
                    userFound.name,
                    email,
                    otp
                )
                return {
                    status: 200,
                    data: {
                        data: true,
                        token: token
                    }
                }
            } else {
                return {
                    status: 500,
                    data: {
                        data: false
                    }
                }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
   async saveUserForgot(token: string, userOtp: string) {
        try {
            let decodedToken = this.jwtToken.verifyJwt(token)
            if(decodedToken?.otp == userOtp) {
                let createdToken = this.jwtToken.createJwt(decodedToken.userFound._id, 'user')
                return { success: true, token: createdToken }
            } else {
                return { success: false }
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async userGetProfile(userId: string) {
        try {
            let user = await this.iUserRepository.findUserById(userId)
           return user
        } catch (error) {
            console.error(error);
            
        }
    }
    async updateProfile(id: string, userInfo: User) {
        try {
            let userExists = await this.iUserRepository.findUserById(id)
            if(userExists) {
                let uploadImage = await this.cloudinary.saveToCloudinary(userInfo.image)
                userInfo.image = uploadImage
                let res = await this.iUserRepository.updateUser(id, userInfo)
                return res
            }
        } catch (error) {
            console.error(error);
            
        }
    }
    async getPackage(packageId: string) {
        try {
            const pckg = await this.iUserRepository.findPackageId(packageId)
            return pckg
        } catch (error) {
            console.error(error);
            
        }
    }
 async updatePassword(email: string, password: string, token: string) {
    try {
        let decodedToken = this.jwtToken.verifyJwt(token)
        const hashedPassword = await this.hashPassword.createHash(password)
        if(hashedPassword && decodedToken) {
            let createdToken = this.jwtToken.createJwt(decodedToken.userFound._id, 'user')
            const updateUser = await this.iUserRepository.resetPassword(email, hashedPassword)
            if(updateUser) {
                return { success: true, token: createdToken }
            }
            return { success: false }
        }
        return { success: false }
    } catch (error) {
        console.error(error);
        
    }
 }
 async fetchPackage(searchTerm: string, sortOption: string, selectedCategory: string, page: number, limit: number) {
    try {
        const fetch = await this.iUserRepository.fetchPackage(searchTerm, sortOption, selectedCategory, page, limit)
        if(fetch) {
            return { success: true, package: fetch.typedPackage, length: fetch.totalLength}
        } else if(!fetch) {
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async rate(bookingId: string, rating: number, review: string, userId: string) {
    try {
        const rate = await this.iUserRepository.rate(bookingId, rating, review, userId)
        if(rate) {
            return { success: true }
        } else if(!rate) {
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async editRate(bookingId: string, rating: number, review: string, userId: string) {
    try {
        const rate = await this.iUserRepository.editRate(bookingId, rating, review, userId)
        if(rate) {
            return { success: true }
        } else if(!rate) {
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async getRating(packageId: string) {
    try {
               
        const getRate = await this.iUserRepository.getRate(packageId)
        if(getRate) {
            return { success: true, rate: getRate }
        } else if(!getRate) {
            
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async getProvider(providerId: string) {
    try {
        const getProvider = await this.iUserRepository.getProvider(providerId)
        if(getProvider) {
            return { success: true, getProvider }
        } else if(!getProvider) {
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async getRateById(bookingId: string) {
    try {
        const getRate = await this.iUserRepository.getRateById(bookingId)
        if(getRate) {
            return { success: true, getRate }
        } else if(!getRate) {
            return { success: false}
        }
    } catch (error) {
        console.error(error);
        
    }
 }
 async getBookingDetails(bookingId: string) {
    try {
        const booking = await this.iUserRepository.getBookingDetails(bookingId)
        if(booking) {
            return { success: true, booking }
        } else if(!booking) {
            return { success: false }
        }
    } catch (error) {
        console.error(error);
        
    }
 }

}
export default userUseCase 