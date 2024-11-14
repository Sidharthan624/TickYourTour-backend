import { Request, Response } from "express";
import Provider from "../../domain/provider";
import Package from "../../domain/package";
import providerUseCase from "../../useCase/providerUseCase";
import JwtToken from "../../infrastructure/utils/JWTtoken";

const jwt = new JwtToken()

class providerController {
    private providerCase: providerUseCase;
    constructor(providerCase: providerUseCase) {
        this.providerCase = providerCase
    }
    async verifyEmail(req: Request, res: Response) {
        try {
            const providerInfo = req.body
            const providerData: any = await this.providerCase.findProvider(providerInfo as Provider)
            if(!providerData.data.data) {
                const token = providerData?.data.token
                
                
                res.status(200).json({ success: true, token: token})
            } else {
                res.status(409).json({ success: false})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
        }
    }
    async verifyOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            console.log('token:',token);
            const providerOtp: string = req.body.otp
            const saveProvider = await this.providerCase.saveProvider(token, providerOtp)
            if(saveProvider?.success) {
                res.cookie('providerToken', saveProvider.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                return res.status(200).json({ saveProvider, token: saveProvider.token})
            } else {
                res.status(402).json({ success: false, message: saveProvider ? saveProvider.message : "Verification unsuccessfull..."})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async resendOtp(req: Request, res: Response) {
        try {
            let token = req.headers.authorization?.split(' ')[1] as string
            if(!token) {
                return res.status(401).json({ success: false, message: 'Unauthorized'})
            }
            const decoded = jwt.verifyJwt(token)
            if(decoded) {
                const providerInfo = decoded.providerInfo
                if(providerInfo) {
                    const providerData: any = await this.providerCase.findProvider(providerInfo as Provider)
                    if(!providerData.data.data) {
                        const token = providerData.data.token
                        res.status(200).json({ success: true, token: token})
                    } else {
                        res.status(409).json({ success: false })
                    }
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server"})
            
        }
    }
    async login(req: Request, res: Response) {
        try {
            const { email,password } = req.body
            const provider = await this.providerCase.providerLogin(email, password)
            if(provider?.success) {
                res.cookie('providerToken', provider.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                return res.status(200).json({ success: true, token: provider.token})
            } else if(!provider?.success) {
               return res.status(200).json({ success: false, message: provider?.message})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
            
        }
    }
    async profile(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const providerProfile = await this.providerCase.providerGetProfile(providerId)
                if(providerProfile) {
                     return res.status(200).json({ success: true, providerProfile})
                } else {
                    return res.status(200).json({success: false, message: 'Authentication error'})
                }
            } else {
                 return res.status(401).json({success: false, message:"User not found"})
            }
                
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message:"Internal server error"})
        }
    }
    async editProfile(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            const providerInfo: Provider = req.body
            const imageFile: Express.Multer.File | undefined = req.file
            if(imageFile) {
                providerInfo.image = imageFile.path
            } else {
                providerInfo.image = ''
            }
            if(providerId) {
                const updatedData = await this.providerCase.updateProfile(providerId, providerInfo)
                if(updatedData) {
                    res.status(200).json({ success: true})
                } else {
                    res.status(401).json({ success: false, message: " Not updated "})
                }
            } else {
                res.status(401).json({ success: false, message: "Something went wrong! Try again "})
            }
                
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('providerToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true})
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: " Internal server error"})
            
        }
    }
    async createPackage(req: Request, res: Response) {
        try {
            console.log('inside create packzasge')
            const providerId = req.providerId
            const packageInfo: Package = req.body
            packageInfo.price = parseInt(req.body.price, 10);
            packageInfo.duration = parseInt(req.body.duration, 10);
            packageInfo.groupSize = parseInt(req.body.groupSize, 10);

            const imageFile: any = req.files as Object
            packageInfo.photos = imageFile
            if(providerId) {
                const create = await this.providerCase.createPackage(providerId, packageInfo)
                if(create) {
                    res.status(200).json({ success: true})
                } else {
                    res.status(401).json({ success: false, message: "There was an error"})
                }
            } else {
                res.status(401).json({ success: false, message: " Something went wrong"})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
            
        }
    }
    async editPackage(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            const packageInfo: Package = req.body
            packageInfo.price = parseInt(req.body.price, 10);
            packageInfo.duration = parseInt(req.body.duration, 10);
            packageInfo.groupSize = parseInt(req.body.groupSize, 10);

            const imageFile: any = req.files as Object
            packageInfo.photos = imageFile
            if(providerId) {
                const create = await this.providerCase.editPackage(packageInfo, providerId)
                if(create) {
                    res.status(200).json({ success: true})
                } else {
                    res.status(401).json({ success: false, message: "There was an error"})
                }
            } else {
                res.status(401).json({ success: false, message: " Something went wrong"})
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error" })
            
        }
    }
    async providerList(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const tourPackage = await this.providerCase.getPackage(providerId)
                if(tourPackage) {
                    res.status(200).json({ success: true, getPackage: tourPackage})
                } else {
                    res.status(401).json({ success: false, message: 'There was an error'})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getUser(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string
            if(userId) {
                const getUser = await this.providerCase.getUser(userId)
                if(getUser?.success) {
                    res.status(200).json({ success: true, data: getUser})
                } else {
                    res.status(200).json({ success: false, message: "Something went wrong"})
                }
            } 
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async dashboard(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const dashboard = await this.providerCase.dashBoard(providerId)
                if(dashboard?.success) {
                    res.status(200).json({ success: true, data: dashboard.dashBoard})
                } else if(!dashboard?.success) {
                    res.status(200).json({ success: false})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getMonthlySales(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const getMonthlySales = await this.providerCase.getMonthlySales(providerId)
                if(getMonthlySales?.success) {
                    res.status(200).json({ success: true, data: getMonthlySales.getMonthlySales})
                } else if(!getMonthlySales?.success) {
                    res.status(200).json({ success: false})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getMonthlyRevenue(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
               const getMonthlyRevenue = await this.providerCase.getMonthlyRevenue(providerId)
               if(getMonthlyRevenue?.success) {
                res.status(200).json({ success: true, data: getMonthlyRevenue.getMonthlyRevenue})
               } else if(!getMonthlyRevenue?.success) {
                res.status(200).json({ success: false })
               }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message:"Internal server error"})
        }
    }
    async addReply(req: Request, res: Response) {
        try {
            const { reviewId, reply } = req.body
            const addReply = await this.providerCase.addReply(reviewId, reply)
            if(addReply) {
                res.status(200).json({ success: true })
            } else if(!addReply) {
                res.status(200).json({success: false})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async findPackageById(req: Request, res: Response) {
        try {
            const packageId = req.query.packageId as string
            const findPackage = await this.providerCase.findPackage(packageId)
            if(findPackage?.success) {
                res.status(200).json({ success: true, data: findPackage.tourPackage })
            } else if(!findPackage?.success) {
                res.status(200).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getNotification(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const notification = await this.providerCase.getNotification(providerId)
                if(notification?.success) {
                    res.status(200).json({ success: true, data: notification.notification})
                } else if(!notification?.success) {
                    res.status(200).json({ success: false})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({success: false, message: "Internal server error"})
        }
    }
}
export default providerController