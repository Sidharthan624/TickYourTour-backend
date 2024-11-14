"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const isImage = file.mimetype.startsWith('image/');
        const isVideo = file.mimetype.startsWith('video/');
        if (isImage) {
            cb(null, path_1.default.join(__dirname, '../public/images'));
        }
        else if (isVideo) {
            cb(null, path_1.default.join(__dirname, '../public/videos'));
        }
        else {
            cb(new Error('Unsupported file type'), '');
        }
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        console.log(`${file.mimetype} uploaded`);
        cb(null, name);
    }
});
const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');
    if (isImage || isVideo) {
        cb(null, true);
    }
    else {
        console.log('Unsupported file type');
    }
};
exports.uploadFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter
});
