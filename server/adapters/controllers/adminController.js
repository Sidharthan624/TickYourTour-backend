"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class adminController {
    constructor(adminCase) {
        this.adminCase = adminCase;
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const admin = yield this.adminCase.adminLogin(email, password);
                if (admin === null || admin === void 0 ? void 0 : admin.success) {
                    res.cookie('adminToken', admin.token, {
                        expires: new Date(Date.now() + 25892000000),
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none'
                    });
                    return res.status(200).json(admin);
                }
                else {
                    return res.status(401).json({ success: false, message: 'Invalid email or password' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                res.cookie('adminToken', '', {
                    httpOnly: true,
                    expires: new Date(0)
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getUser = yield this.adminCase.getUsers();
                if (getUser) {
                    return res.status(200).json({ success: true, getUser });
                }
                else {
                    return res.status(404).json({ success: false, message: " User not found" });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const block = yield this.adminCase.blockUser(userId);
                if (block) {
                    res.cookie('userToken', '', {
                        httpOnly: true,
                        expires: new Date(0)
                    });
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: 'Something went wrong' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    provider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getProvider = yield this.adminCase.getProviders();
                if (getProvider) {
                    return res.status(200).json({ success: true, getProvider });
                }
                else {
                    return res.status(404).json({ success: false, message: "Provider not found" });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    blockProvider(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providerId = req.params.id;
                const block = yield this.adminCase.blockProvider(providerId);
                if (block) {
                    return res.status(200).json({ success: true });
                }
                else {
                    res.status(500).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, description } = req.body;
                let save = yield this.adminCase.addCategory(name, description);
                if (save === null || save === void 0 ? void 0 : save.success) {
                    if (save === null || save === void 0 ? void 0 : save.duplicate) {
                        return res.status(200).json({ success: false, message: 'Category already exists !!' });
                    }
                    else if (!(save === null || save === void 0 ? void 0 : save.duplicate)) {
                        return res.status(200).json({ success: true, message: 'New category added successfully' });
                    }
                }
                else if (!(save === null || save === void 0 ? void 0 : save.success)) {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    category(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getCategory = yield this.adminCase.getCategory();
                if (getCategory) {
                    return res.status(200).json({ success: true, getCategory });
                }
                else {
                    res.status(401).json({ success: false, message: 'User not found' });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    hideCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.body.id;
                let hide = yield this.adminCase.hideCategory(categoryId);
                if (hide) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    editCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, name, description } = req.body;
                const editCategory = yield this.adminCase.editCategory(id, name, description);
                if (editCategory === null || editCategory === void 0 ? void 0 : editCategory.success) {
                    if (editCategory === null || editCategory === void 0 ? void 0 : editCategory.duplicate) {
                        return res.status(500).json({ success: false, message: "Category already exists" });
                    }
                    else if (!(editCategory === null || editCategory === void 0 ? void 0 : editCategory.duplicate)) {
                        return res.status(200).json({ success: true, message: "New category added successfully" });
                    }
                }
                else if (!(editCategory === null || editCategory === void 0 ? void 0 : editCategory.success)) {
                    return res.status(500).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    package(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getProperty = yield this.adminCase.getProperty();
                if (getProperty) {
                    return res.status(200).json({ success: true, getProperty });
                }
                else {
                    return res.status(200).json({ success: false, message: 'Property not found' });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    packageRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getProperty = yield this.adminCase.propertyRequest();
                if (getProperty) {
                    return res.status(200).json({ success: true, getProperty });
                }
                else {
                    return res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    packageStatusChange(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id, status } = req.body;
                const changeStatus = yield this.adminCase.changeStatus(id, status);
                if (changeStatus) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(401).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    hidePackage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packageId = req.body.id;
                let hide = yield this.adminCase.hidePackage(packageId);
                if (hide) {
                    res.status(200).json({ success: true });
                }
                else {
                    res.status(200).json({ success: false, message: "Something went wrong" });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    findCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.query.id;
                const findCategory = yield this.adminCase.findCategory(categoryId);
                if (findCategory === null || findCategory === void 0 ? void 0 : findCategory.success) {
                    return res.status(200).json({ success: true, data: findCategory.category });
                }
                return res.status(200).json({ success: false });
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.adminCase.getBooking();
                if (booking === null || booking === void 0 ? void 0 : booking.success) {
                    res.status(200).json({ success: true, data: booking.data });
                }
                else if (!(booking === null || booking === void 0 ? void 0 : booking.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    fetchBooking(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = req.query.filter;
                const fetch = yield this.adminCase.fetchBooking(filter);
                console.log(fetch === null || fetch === void 0 ? void 0 : fetch.booking);
                if (fetch === null || fetch === void 0 ? void 0 : fetch.success) {
                    res.status(200).json({ success: true, reservation: fetch.booking });
                }
                else if (!(fetch === null || fetch === void 0 ? void 0 : fetch.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    dashboard(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboard = yield this.adminCase.dashboard();
                if (dashboard === null || dashboard === void 0 ? void 0 : dashboard.success) {
                    res.status(200).json({ success: true, data: dashboard.dashboard });
                }
                else if (!(dashboard === null || dashboard === void 0 ? void 0 : dashboard.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMonthlySales(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMonthlySales = yield this.adminCase.getMonthlySales();
                if (getMonthlySales === null || getMonthlySales === void 0 ? void 0 : getMonthlySales.success) {
                    res.status(200).json({ success: true, data: getMonthlySales.monthlySale });
                }
                else if (!(getMonthlySales === null || getMonthlySales === void 0 ? void 0 : getMonthlySales.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    getMonthlyRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const getMonthlyRevenue = yield this.adminCase.getMonthlyRevenue();
                if (getMonthlyRevenue === null || getMonthlyRevenue === void 0 ? void 0 : getMonthlyRevenue.success) {
                    res.status(200).json({ success: true, data: getMonthlyRevenue.monthlyRevenue });
                }
                else if (!(getMonthlyRevenue === null || getMonthlyRevenue === void 0 ? void 0 : getMonthlyRevenue.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
        });
    }
    addNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { providerId, status, id } = req.body;
                const notification = yield this.adminCase.addNotification(providerId, status, id);
                if (notification === null || notification === void 0 ? void 0 : notification.success) {
                    res.status(200).json({ success: true });
                }
                else if (!(notification === null || notification === void 0 ? void 0 : notification.success)) {
                    res.status(200).json({ success: false });
                }
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
            }
        });
    }
}
exports.default = adminController;
