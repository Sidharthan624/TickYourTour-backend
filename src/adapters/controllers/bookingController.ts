import { Request, Response } from "express";
import Booking from "../../domain/booking";
import bookingUseCase from "../../useCase/bookingUseCase";

class bookingController {
    private bookingCase: bookingUseCase
    constructor(bookingCase: bookingUseCase) {
        this.bookingCase = bookingCase
    }
    async newBooking(req: Request, res: Response) {
        try {
            const data = req.body
            const book = await this.bookingCase.newBooking(data)
            if(book?.success) {
                res.status(200).json({ success: true, data: book.data})
            } else if(!book?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getCheckout(req: Request, res: Response) {
        try {
            const bookingId = req.params.bookingId
            if(bookingId) {
                const getBooking = await this.bookingCase.getBooking(bookingId)
                if(getBooking) {
                    res.status(200).json({ success: true, data: getBooking})
                } else {
                    res.status(500).json({ success: false })
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async proceedForPayment(req: Request, res: Response) {
        try {
            const bookingDetails = req.body.bookingDetails
            
            const payment = await this.bookingCase.proceedForPayment(bookingDetails)
            if(payment) {
               res.status(200).json({ success: true, data: payment})
            } else {
                res.status(500).json({ success: false})
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async proceedForSubscription(req: Request, res: Response) {
        try {
            const providerId = req.providerId
            if(providerId) {
                const subscription = await this.bookingCase.proceedForSubscription(providerId)
                if(subscription) {
                    res.status(200).json({ success: true, data: subscription })
                } else {
                    res.status(500).json({ success: false, message: "Payment failed" })
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async saveSession(req: Request, res: Response) {
        try {
            const { sessionId, bookingId } = req.body
            const save = await this.bookingCase.saveSession(sessionId, bookingId)
            if(save?.success) {
                res.status(200).json({ success: true })
            } else {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async confirmPayment(req: Request, res:Response) {
        try {
            
            switch(req.body.type) {
                case 'checkout.session.completed':
                    
                    const session = req.body.data.object
                    if(session.subscription) {
                        return
                    }
                    const paymentId = session.payment_intent
                    const sessionId = session.id
                    const updatePaymentStatus = await this.bookingCase.updatePaymentStatus(sessionId, paymentId)
                    if(updatePaymentStatus?.success) {
                        const sendMail = await this.bookingCase.sendConfirmationMail(sessionId)
                        if(sendMail?.success) {
                            res.status(200).json({ success: true })
                        }
                    }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async confirmSubscription(req: Request, res: Response) {
        try {
           switch(req.body.type) {
            case 'checkout.session.completed':
                const session = req.body.data.object
                const subscriptionId = session.subscription
                if(!subscriptionId) {
                    return
                }
                const providerId = session.metadata.providerId
                const updateProvider = await this.bookingCase.saveSubscription(subscriptionId, providerId)
                if(updateProvider?.success) {
                    res.status(200).json({ success: true })
                }
           }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async getBookings(req: Request, res: Response) {
        try {
            const userId = req.query.userId as string
            const page = Number(req.query.page)
            const limit = Number(req.query.limit)
            const getBooking = await this.bookingCase.getBookings(userId, page, limit)
            if(getBooking?.success) {
                res.status(200).json({ success: true, booking: getBooking.bookings, length: getBooking.length})
            } else if(!getBooking?.success) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
            
        }
    }
    async getBookingsByProviderId(req: Request, res: Response) {
        try {
            const providerId = req.params.providerId
            const getBookingsByProvider = await this.bookingCase.getBookingByProvider(providerId)
            if(getBookingsByProvider) {
                res.status(200).json({ success: true, data: getBookingsByProvider})
            } else if(!getBookingsByProvider) {
                res.status(500).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async cancelBooking(req: Request, res: Response) {
        try {
            const bookingId = req.body.bookingId
            const cancel = await this.bookingCase.cancel(bookingId)
            if(cancel?.success) {
                res.status(200).json({ success: true })
            } else if(!cancel?.success) {
                res.status(200).json({ success: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Internal server error"})
        }
    }
    async cancelSubscription(req: Request, res: Response) {
        try {
            const providerId = req.body.providerId
            const cancel = await this.bookingCase.cancelSubscription(providerId)
            if(cancel?.success) {
               res.status(200).json({ success: true})
            } else if(!cancel?.success) {
                res.status(500).json({ succcess: false })
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' })
        }
    }
}
export default bookingController