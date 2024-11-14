import providerController from "../../adapters/controllers/providerController";
import providerRepository from "../repository/providerRepository";
import providerUseCase from "../../useCase/providerUseCase";
import otpGenerate from "../utils/generateOTP";
import sendMail from "../utils/sendEmail";
import JwtToken from "../utils/JWTtoken";
import hashPassword from "../utils/hashPassword";
import authenticate from '../middleware/providerAuth'
import { uploadFile  } from "../middleware/multer";
import Cloudinary from "../utils/cloudinary";
import express from 'express'

const repository = new providerRepository()
const otp = new otpGenerate()
const mail = new sendMail()
const jwt = new JwtToken()
const pwd = new hashPassword()
const cloud = new Cloudinary()

const providerCase = new providerUseCase(repository, otp, mail, jwt, pwd, cloud)
const controller = new providerController(providerCase)
const router = express.Router()

router.post('/verifyEmail', (req, res) => { controller.verifyEmail(req, res)})
router.post('/verifyOtp', (req, res) => { controller.verifyOtp(req, res)})
router.post('/resendOtp', (req, res) => { controller.resendOtp(req, res)})
router.post('/login', (req, res) => { controller.login(req, res)})
router.get('/profile', authenticate, (req, res) =>{ controller.profile(req, res)})
router.put('/editProfile', authenticate, uploadFile.single('image'), (req, res) => { controller.editProfile(req, res)})
router.post('/logout', (req, res) => { controller.logout(req, res)})
router.post('/createPackage', authenticate, uploadFile.array('image', 5), (req, res) => { controller.createPackage(req, res)})
router.post('/editPackage', authenticate, (req, res) => { controller.editPackage(req,res)})
router.get('/providerList', authenticate, (req, res) => { controller.providerList(req, res)})
router.get('/getUser', (req, res) => { controller.getUser(req, res)})
router.get('/dashboard', authenticate, (req, res) => { controller.dashboard(req, res)})
router.get('/getMonthlySales', authenticate, (req, res) => { controller.getMonthlySales(req, res)})
router.get('/getMonthlyRevenue', authenticate, (req, res) => { controller.getMonthlyRevenue(req, res)})
router.post('/addReply', (req, res) => { controller.addReply(req, res)})
router.get('/findPackageById', (req, res) => { controller.findPackageById(req, res)})
router.post('/getNotification', authenticate, (req, res) => { controller.getNotification(req,res)})
 export default router