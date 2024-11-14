import bookingController from "../../adapters/controllers/bookingController";
import bookingRepository from "../repository/bookingRepository";
import bookingUseCase from "../../useCase/bookingUseCase";
import StripePayment from "../utils/stripe";
import sendMail from "../utils/sendEmail";
import express from 'express'
import authenticate from '../middleware/providerAuth'

const bookingrepository = new bookingRepository()
const stripepayment = new StripePayment()
const sendmail = new sendMail()
const bookingusecase = new bookingUseCase(bookingrepository, stripepayment, sendmail)
const controller = new bookingController(bookingusecase)

const router = express.Router()

router.post('/newBooking', (req, res) => { controller.newBooking(req, res) })
router.get('/getCheckout/:bookingId', (req, res) => { controller.getCheckout(req, res)})
router.post('/proceedForPayment', (req, res) => { controller.proceedForPayment(req, res)})
router.post('/proceedForSubscription', authenticate, (req, res) => { controller.proceedForSubscription(req, res)})
router.post('/saveSession', (req, res) => { controller.saveSession(req, res)})
router.post('/confirmPayment', (req, res) => { controller.confirmPayment(req, res)})
router.post('/confirmSubscription', (req, res) => { controller.confirmSubscription(req, res)})
router.get('/getBookings', (req, res) => { controller.getBookings(req, res)})
router.post('/cancelBooking', (req, res) => { controller.cancelBooking(req, res)})
router.post('/cancelBooking', (req, res) => { controller.cancelBooking(req, res)})
router.post('/cancelSubscription', (req, res) => { controller.cancelSubscription(req, res)})
router.get('/getBookingByproviderId/:providerId', (req, res) => { controller.getBookingsByProviderId(req, res)})

export default router