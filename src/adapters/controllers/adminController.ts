import { Request, Response } from "express";
import adminUseCase from "../../useCase/adminUseCase";
class adminController {
    private adminCase: adminUseCase;
    constructor(adminCase: adminUseCase) {
        this.adminCase = adminCase
    }
    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body
            const admin = await this.adminCase.adminLogin(email, password)
            if(admin?.success) {
                res.cookie('adminToken', admin.token, {
                    expires: new Date(Date.now() + 25892000000),
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none'
                })
                return res.status(200).json(admin)
            } else {
                return res.status(200).json({ success: false,message: 'Invalid email or password' });
              }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async logout(req: Request, res: Response) {
        try {
            res.cookie('adminToken', '', {
                httpOnly: true,
                expires: new Date(0)
            })
            res.status(200).json({ success: true })
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"}) 
        }
    }
    async user(req: Request, res: Response) {
        try {
            const getUser = await this.adminCase.getUsers()
            if(getUser) {
                return res.status(200).json({ success: true, getUser })
            } else {
                return res.status(404).json({ success: false, message: " User not found"})
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async blockUser(req: Request, res: Response) {
        try {
            const userId = req.params.id
            const block = await this.adminCase.blockUser(userId)
            if(block) {
                res.cookie('userToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                })
                res.status(200).json({ success: true})
            } else {
                res.status(500).json({ success: false, message: 'Something went wrong'})
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async provider(req: Request, res: Response) {
        try {
            const getProvider = await this.adminCase.getProviders()
            if(getProvider) {
                return res.status(200).json({ success: true, getProvider})
            } else {
                return res.status(404).json({ success: false, message: "Provider not found" })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async blockProvider(req: Request, res: Response) {
        try {
           const providerId = req.params.id
           const block = await this.adminCase.blockProvider(providerId)
           if(block) {
            return res.status(200).json({ success: true})
           } else {
            res.status(500).json({ success: false, message: "Something went wrong" })
           }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async addCategory(req: Request, res: Response) {
        try {
          const { name, description } = req.body;
          let save = await this.adminCase.addCategory(name, description)
          if (save?.success) {
            if (save?.duplicate) {
              return res.status(200).json({ success: false, message: 'Category already exists !!' })
            } else if (!save?.duplicate) {
              return res.status(200).json({ success: true, message: 'New category added successfully' })
            }
          } else if (!save?.success) {
            res.status(200).json({ success: false, message: "Something went wrong" })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async category(req: Request, res:Response) {
        try {
            const getCategory = await this.adminCase.getCategory()
            if(getCategory) {
                return res.status(200).json({ success: true, getCategory})
            } else {
                res.status(401).json({ success: false, message: 'User not found'})
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async hideCategory(req: Request, res: Response) {
        try {
          const categoryId = req.body.id
          let hide = await this.adminCase.hideCategory(categoryId)
          if (hide) {
            res.status(200).json({ success: true });
          } else {
            res.status(200).json({ success: false, message: "Something went wrong" })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async editCategory(req: Request, res: Response) {
        try {
            const { id, name, description } = req.body
            const editCategory = await this.adminCase.editCategory(id,name,description)
            if(editCategory?.success) {
                if(editCategory?.duplicate){
                    return res.status(200).json({ success: false, message: "Category already exists"})
                } else if(!editCategory?.duplicate) {
                    return res.status(200).json({ success: true, message: "New category added successfully"})
                }
            } else if(!editCategory?.success) {
                return res.status(500).json({ success: false, message: "Something went wrong"})
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async package(req: Request, res: Response) {
        try {
          const getPackage = await this.adminCase.getProperty()
          if (getPackage) {
            return res.status(200).json({ success: true, getPackage })
          } else {
            return res.status(200).json({ success: false, message: 'Property not found' })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async packageRequest(req: Request, res: Response) {
        try {
          const getPackage = await this.adminCase.propertyRequest()
          if (getPackage) {
            return res.status(200).json({ success: true, getPackage })
          } else {
            return res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async packageStatusChange(req: Request, res: Response) {
        try {
          const { id, status } = req.body
          const changeStatus = await this.adminCase.changeStatus(id, status);
          if (changeStatus) {
            res.status(200).json({ success: true })
          } else {
            res.status(401).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async hidePackage(req: Request, res: Response) {
        try {
          const packageId = req.body.id
          let hide = await this.adminCase.hidePackage(packageId);
          if (hide) {
            res.status(200).json({ success: true });
          } else {
            res.status(200).json({ success: false, message: "Something went wrong" })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async findCategory(req: Request, res: Response) {
        try {
          const categoryId = req.query.id as string
          const findCategory = await this.adminCase.findCategory(categoryId)
          if (findCategory?.success) {
            return res.status(200).json({ success: true, data: findCategory.category })
          }
          return res.status(200).json({ success: false })
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async getBooking(req: Request, res: Response) {
        try {
          const booking = await this.adminCase.getBooking()
          if (booking?.success) {
            res.status(200).json({ success: true, data: booking.data })
          } else if (!booking?.success) {
            res.status(200).json({ success: false });
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async fetchBooking(req: Request, res: Response) {
        try {
          const filter = req.query.filter as string
          const fetch = await this.adminCase.fetchBooking(filter);
          console.log(fetch?.booking)
          if (fetch?.success) {
            res.status(200).json({ success: true, reservation: fetch.booking })
          } else if (!fetch?.success) {
            res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async dashboard(req: Request, res: Response) {
        try {
          const dashboard = await this.adminCase.dashboard()
          if (dashboard?.success) {
            res.status(200).json({ success: true, data: dashboard.dashboard })
          } else if (!dashboard?.success) {
            res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async getMonthlySales(req: Request, res: Response) {
        try {
          const getMonthlySales = await this.adminCase.getMonthlySales()
          if (getMonthlySales?.success) {
            res.status(200).json({ success: true, data: getMonthlySales.monthlySale })
          } else if (!getMonthlySales?.success) {
            res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }
      async getMonthlyRevenue(req: Request, res: Response) {
        try {
          const getMonthlyRevenue = await this.adminCase.getMonthlyRevenue()
          if (getMonthlyRevenue?.success) {
            res.status(200).json({ success: true, data: getMonthlyRevenue.monthlyRevenue })
          } else if (!getMonthlyRevenue?.success) {
            res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: "Internal server error"})
        }
      }async addNotification(req: Request, res: Response) {
        try {
          const { providerId, status, id } = req.body
          const notification = await this.adminCase.addNotification(providerId, status, id)
          if (notification?.success) {
            res.status(200).json({ success: true });
          } else if (!notification?.success) {
            res.status(200).json({ success: false })
          }
        } catch (error) {
          console.log(error)
          return res.status(500).json({ success: false, message: 'Internal server error' });
        }
      }
    
    }
    
    export default adminController;