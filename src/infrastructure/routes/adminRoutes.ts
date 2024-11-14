import adminController from "../../adapters/controllers/adminController";
import adminRepository from "../repository/adminRepository";
import adminUseCase from "../../useCase/adminUseCase";
import express from 'express'
import hashPassword from "../utils/hashPassword";
import JwtToken from "../utils/JWTtoken";
import authenticate from '../middleware/adminAuth'

const repository = new adminRepository()
const hashPass = new hashPassword()
const jwt = new JwtToken()

const adminCase = new adminUseCase(repository, hashPass, jwt)
const controller = new adminController(adminCase)
const router = express.Router()

router.post('/login', (req, res) => { controller.login(req, res)})
router.post('/logout', (req, res) => { controller.logout(req, res)})
router.get('/user', authenticate, (req, res) => { controller.user(req, res)})
router.post('/blockUser/:id', authenticate, (req, res) => { controller.blockUser(req, res)})
router.get('/provider', authenticate, (req,res) => { controller.provider(req, res)})
router.post('/blockProvider/:id', (req, res) => { controller.blockProvider(req, res)})
router.post('/addCategory', authenticate, (req, res) => { controller.addCategory(req, res)})
router.get('/category', (req, res) => { controller.category(req, res)})
router.post('/hideCategory', authenticate, (req, res) => { controller.hideCategory(req, res) })
router.post('/editCategory', authenticate, (req, res) => { controller.editCategory(req, res)})
router.get('/package', authenticate, (req, res) => { controller.package(req, res)})
router.post('/packageStatusChange', authenticate, (req, res) => { controller.packageStatusChange(req, res)})
router.post('/hidePackage', authenticate, (req, res) => { controller.hidePackage(req, res)})
router.get('/findCategory', authenticate, (req, res) => { controller.findCategory(req, res)})
router.get('/getBooking', authenticate, (req, res) => { controller.getBooking(req, res)})
router.get('/fetchBooking', authenticate, (req, res) => { controller.fetchBooking(req, res) })
router.get('/dashboard', authenticate, (req, res) => { controller.dashboard(req, res)})
router.get('/getMonthlySales', authenticate, (req, res) => { controller.getMonthlySales(req, res)})
router.get('/getMonthlyRevenue', authenticate, (req, res) => { controller.getMonthlyRevenue(req, res)})
router.get('/packageRequest', authenticate, (req, res) => { controller.packageRequest(req, res)})
router.post('/addNotification', authenticate, (req, res) => { controller.addNotification(req, res)})

export default router