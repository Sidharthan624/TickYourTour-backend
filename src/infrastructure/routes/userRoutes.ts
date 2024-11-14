import userController from "../../adapters/controllers/userController";
import UserRepository from "../repository/userRepository";
import sendMail from "../utils/sendEmail";
import otpGenerate from "../utils/generateOTP";
import userUseCase from "../../useCase/userUseCase";
import JwtToken from "../utils/JWTtoken";
import hashPassword from "../utils/hashPassword";
import authenticate from '../middleware/userAuth'
import express from 'express'
import Cloudinary from "../utils/cloudinary";
import { uploadFile } from "../middleware/multer";

const repository = new UserRepository()
const otp = new otpGenerate()
const sendOtp = new sendMail()
const jwt = new JwtToken()
const hashPwd = new hashPassword()
const cloud = new Cloudinary()

const usercase = new userUseCase(repository, hashPwd, otp, jwt, sendOtp, cloud)
const controller = new userController(usercase)

const router = express.Router()

router.post('/verifyMail', (req, res) => {controller.verifyEmail(req, res)})
router.post('/verifyOtp', (req, res) => {controller.verifyOtp(req, res)})
router.post('/resendOtp', (req, res) => {controller.resendOtp(req, res)})
router.post('/login', (req, res) => {controller.login(req, res)})
router.post('/logout', (req, res) => {controller.logout(req, res)})
router.post('/gSignUp', (req, res) => {controller.gSignUp(req, res)})
router.post('forgotPassword', (req, res) => { controller.forgotPassword(req, res)})
router.post('/resetPassword', (req, res) => { controller.resetPassword(req, res)})
router.post('/verifyForgotPassword', (req, res) => { controller.verifyOtpForgotPassword(req, res)})
router.get('/profile', authenticate, (req, res) => { controller.profile(req, res)})
router.put('/editProfile', authenticate, uploadFile.single('image'), (req, res) => { controller.editProfile(req, res)})
router.get('/singlePackage/:id', authenticate, (req, res) => { controller.singlePackage(req, res)})
router.get('/fetchPackage', authenticate, (req, res) => { controller.fetchPackage(req, res)})
router.post('/rate', authenticate, (req, res) => { controller.rate(req, res)})
router.post('editRate', authenticate, (req, res) => { controller.editRate(req, res)})
router.get('/getRatings', authenticate, (req, res) => { controller.getRating(req, res)})
router.get('/getProvider', authenticate, (req, res) => { controller.getProvider(req, res)})
router.get('/findRateById', authenticate, (req, res) => { controller.findRatingById(req, res)})
router.get('/getBookingDetails', authenticate, (req, res) => { controller.getBookingDetails(req, res)})
router.get('/findUser', authenticate, (req, res) => { controller.findUser(req, res)})

export default router
