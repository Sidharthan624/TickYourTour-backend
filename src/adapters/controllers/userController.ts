import { Request, Response } from 'express'
import User from '../../domain/user'
import userUseCase from '../../useCase/userUseCase'
import JwtToken from '../../infrastructure/utils/JWTtoken'
import { log } from 'console'
const jwt = new JwtToken()

class userController {
    private usercase: userUseCase
    constructor(usercase: userUseCase) {
        this.usercase = usercase
    }
    async verifyEmail(req: Request, res: Response) {
        try {
            const userInfo = req.body
           const userData: any = await this.usercase.findUser(userInfo as User) 
           if(!userData.data.data) {
            const token = userData?.data.token
            
            
            res.status(200).json({ success:true, token:token })
            
            
           } else {
            res.status(200).json({ success:false, message: " User already exists" })
           }

           

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "internal server error " })
            
        }
    }
    async verifyOtp(req: Request, res:Response) {
        try {
            log('hi')
            const token = req.headers.authorization?.split(' ')[1] as string
            const userOtp: string = req.body.otp
            const saveUser = await this.usercase.saveUser(token, userOtp)
            if(saveUser?.success) {
                res.cookie("userToken", saveUser.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none' 
                })
                return res.status(200).json({success: true,token:saveUser.token})
            }else if(!saveUser?.success) {
                res.status(200).json({message: saveUser ? saveUser.message : "Verification failed"})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"})
            
            
        }
    }
    async resendOtp(req:Request, res:Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1] as string
            if(!token) {
                return res.status(401).json({success:false, message:"Unauthorized"})
            }
            const decoded = jwt.verifyJwt(token)
            if(decoded) {
                const userInfo = decoded.userInfo
                if(userInfo) {
                    const userData: any = await this.usercase.findUser(userInfo as User)
                    if(!userData.data.data) {
                        const token = userData?.data.token
                        res.status(200).json({ success: true, token: token})
                    }
                } else {
                    res.status(409).json({success:false})
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"})
            
        }
    }
    async gSignUp(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body
            const user = this.usercase.gSignUp(name, email, password)
            return res.status(200).json(user)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error "})
            
        }
    }
    async login(req:Request, res: Response) {
        try {
            const { email, password } = req.body
            const user = await this.usercase.userLogin(email, password)
            if(user?.success) {
                res.cookie("userToken",user.token,{
                    expires: new Date(Date.now() + 25892000000 ),
                    httpOnly:true,
                    secure: true,
                    sameSite:'none'
                })
                return res.status(200).json({success: true, token: user.token})
            } else if(!user?.success) {
                res.status(200).json({success:false, message: user?.message})
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Internal server error"})
            
        }
    }
    async logout(req:Request, res:Response) {
        try {
            res.cookie("userToken", "", {
                httpOnly: true,
                expires: new Date(0)
            })
            return res.status(200).json({ success:true })
        } catch (error) {
            console.log(error);
            
            
        }
    }
    async resetPassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            const { email, password } = req.body
            const userFound = await this.usercase.findUserByEmail(email)
            if(userFound) {
                const updatePassword = await this.usercase.updatePassword(email, password, token)
                if(updatePassword?.success) {
                    res.status(200).json({ success:true, message: 'Successfully logged in', token: updatePassword.token})
                } else if(!updatePassword?.success) {
                    res.status(500).json({ success: false, message: "Something went wrong" })
                }
            } else {
                res.status(404).json({ success: false, message: "No user found with this email" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async forgotPassword(req: Request, res: Response) {
        try {
            const { email } = req.body
            const userExists = await this.usercase.forgotPassword(email)
            if(userExists?.data.data) {
                const token = userExists.data.token
                res.status(200).json({ success: true, token: token })
            } else {
                res.status(500).json({ success: false})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async verifyOtpForgotPassword(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split('')[1] as string
            const userOtp: string = req.body.otp
            const save = await this.usercase.saveUserForgot(token, userOtp)
            if(save?.success) {
                res.cookie('userToken', save?.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'

                })
                return res.status(200).json({ success: true, token: save.token})
            } else {
                return res.status(200).json({ success: false, message: "Invalid otp"})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async profile(req: Request, res: Response) {
        try {
            const userId = req.userId
            if(userId) {
                const userProfile = await this.usercase.userGetProfile(userId)
                if(userProfile) {
                    return res.status(200).json({ success: true, userProfile })
                } else {
                    return res.status(401).json({ success: false, message: 'Authentication error'})
                }
            } else {
                return res.status(404).json({ success: false, message: "User Id not found" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const userId = req.userId
            const userInfo: User = req.body
            const imageFile: Express.Multer.File | undefined = req.file
            if(imageFile) {
                userInfo.image = imageFile.path
            } else {
                userInfo.image = ''
            }
            if(userId) {
                const updateData = await this.usercase.updateProfile(userId, userInfo)
                if(updateData) {
                    res.status(200).json({ success: true })
                } else {
                    res.status(401).json({ success: false, message: "Not updated!"})
                }
            } else {
                res.status(500).json({ success: false, message: "Something went wrong" })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async singlePackage(req: Request, res: Response) {
        try {
            const packageId = req.params.id
            if(packageId) {
                const getPackage = await this.usercase.getPackage(packageId)
                if(getPackage) {
                    res.status(200).json({ success: true, getPackage})
                } else {
                    res.status(401).json({ success: false, message: "Something went wrong" })
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async fetchPackage(req: Request, res: Response) {
        try {
            const searchTerm = req.query.searchTerm as string
            const sortOption = req.query.sortOption as string
            const selectedCategory = req.query.selectedCategory as string
            const limit = Number(req.query.limit)
            const page = Number(req.query.page)
            const fetch = await this.usercase.fetchPackage(searchTerm, sortOption, selectedCategory,page, limit)
            if(fetch?.success) {
                res.status(200).json({ success: true, packages: fetch.package, totalPackages: fetch.length, })
            } else if(!fetch?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false })
        }
    }
    async rate(req: Request, res: Response) {
        try {
            const { bookingId, rating, review, userId } = req.body
            const rate = await this.usercase.rate(bookingId, rating, review, userId)
            if(rate?.success) {
                res.status(200).json({ success: true })
            } else if(!rate?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async editRate(req: Request, res: Response) {
        try {
            const { bookingId, rating, review, userId } = req.body
            const rate = await this.usercase.editRate(bookingId, rating, review, userId)
            if(rate?.success) {
                res.status(200).json({ success: true })
            } else if(!rate?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getRating(req: Request, res: Response) {
        try {
            const packageId = req.query.id as string
            
            const ratings = await this.usercase.getRating(packageId)
            if(ratings?.success) {
                res.status(200).json({ success: true, data: ratings.rate})
            } else if(!ratings?.success) {

                
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getProvider(req: Request, res: Response) {
        try {
            const providerId = req.query.providerId as string
            const providerData = await this.usercase.getProvider(providerId)
            if(providerData?.success) {
                res.status(200).json({ success: true, data: providerData.getProvider})
            } else if(!providerData?.success) {
                res.status(500).json({ succes: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async findRatingById(req: Request, res: Response) {
        try {
            const bookingId = req.query.bookingId as string
            const rateData = await this.usercase.getRateById(bookingId)
            if(rateData?.success) {
                res.status(200).json({ success: true, data: rateData.getRate})
            } else if(!rateData?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async getBookingDetails(req: Request, res: Response) {
        try {
            const bookingId = req.query.bookingId as string
            const booking = await this.usercase.getBookingDetails(bookingId)
            if(booking?.success) {
                res.status(200).json({ success: true, data: booking.booking})
            } else if(!booking?.success) {
                res.status(500).json({ succes: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async findUser(req: Request, res: Response) {
        try {
            const userId = req.userId
            if(userId) {
                const userProfile = await this.usercase.userGetProfile(userId)
                if(userProfile) {
                    return res.status(200).json({ success: true, userProfile})
                } else {
                    return res.status(401).json({ success: false, message: 'Authentication error'})
                }
            } else {
                return res.status(404).json({ success: false, message: 'User Id not found' })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }

}
export default userController