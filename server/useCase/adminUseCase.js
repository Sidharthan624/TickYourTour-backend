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
class adminUseCase {
    constructor(iAdminRepository, hashPassword, JWTtoken) {
        this.iAdminRepository = iAdminRepository;
        this.hashPassword = hashPassword;
        this.JWTtoken = JWTtoken;
    }
    adminLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const adminFound = yield this.iAdminRepository.findByEmail(email);
                if (adminFound) {
                    const passwordMatch = yield this.hashPassword.compare(password, adminFound.password);
                    if (passwordMatch) {
                        const token = this.JWTtoken.createJwt(adminFound._id, 'admin');
                        return { success: true, adminData: adminFound, token };
                    }
                    else {
                        return { success: false, message: 'Invalid credentials' };
                    }
                }
                else {
                    return { success: false, message: 'Invalid credentials' };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.iAdminRepository.findUsers();
                if (users) {
                    return users;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    blockUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.iAdminRepository.blockUser(id);
                return blocked;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const providers = yield this.iAdminRepository.findProviders();
                if (providers) {
                    return providers;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    blockProvider(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let blocked = yield this.iAdminRepository.blockProvider(id);
                return blocked;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addCategory(name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let saveCategory = yield this.iAdminRepository.saveCategory(name, description);
                return saveCategory;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this.iAdminRepository.findCategories();
                if (categories) {
                    return categories;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    hideCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hide = yield this.iAdminRepository.hideCategory(id);
                return hide;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    editCategory(id, name, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let edit = yield this.iAdminRepository.editCategory(id, name, description);
                return edit;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getProperty() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield this.iAdminRepository.findPackages();
                if (packages) {
                    return packages;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    propertyRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const packages = yield this.iAdminRepository.packageRequest();
                if (packages) {
                    return packages;
                }
                return null;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    changeStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const statusChange = yield this.iAdminRepository.changePackageStatus(id, status);
                return statusChange;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    hidePackage(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let hide = yield this.iAdminRepository.hidePackage(id);
                return hide;
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    findCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this.iAdminRepository.findCategory(categoryId);
                if (category) {
                    return { success: true, category: category };
                }
                return { success: false };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getBooking() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const booking = yield this.iAdminRepository.getBooking();
                if (booking) {
                    return { success: true, data: booking };
                }
                return { success: false };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    fetchBooking(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const fetch = yield this.iAdminRepository.fetchBooking(filter);
                if (fetch) {
                    return { success: true, booking: fetch };
                }
                return { success: false };
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    dashboard() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dashboard = yield this.iAdminRepository.dashboard();
                if (dashboard) {
                    return { success: true, dashboard };
                }
                else if (!dashboard) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getMonthlySales() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlySale = yield this.iAdminRepository.getMonthlySales();
                if (monthlySale) {
                    return { success: true, monthlySale };
                }
                else if (!monthlySale) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    getMonthlyRevenue() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const monthlyRevenue = yield this.iAdminRepository.getMonthlyRevenue();
                if (monthlyRevenue) {
                    return { success: true, monthlyRevenue };
                }
                else if (!monthlyRevenue) {
                    return { success: false };
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
    addNotification(providerId, status, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let notification;
                if (status == 'Accepted') {
                    notification = 'Your package has been approved...';
                }
                else if (status == 'Rejected') {
                    notification = 'Your package has been rejected...';
                }
                if (notification) {
                    const addNotification = yield this.iAdminRepository.addNotification(providerId, notification, id);
                    if (addNotification) {
                        return { success: true };
                    }
                    else if (!addNotification) {
                        return { success: false };
                    }
                }
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
exports.default = adminUseCase;
