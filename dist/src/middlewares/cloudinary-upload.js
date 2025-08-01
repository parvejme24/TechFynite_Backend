"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCategoryImageCloudinary = exports.uploadUserProfileCloudinary = exports.uploadBlogFilesCloudinary = exports.uploadTemplateFilesCloudinary = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
// Cloudinary storage configuration
const cloudinaryStorage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: cloudinary_1.default,
    params: {
        folder: 'techfynite',
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'zip'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
    },
});
// File filter function
const fileFilter = (req, file, cb) => {
    const fileExtension = file.originalname.toLowerCase().split('.').pop();
    if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
        // Images allowed
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed for image and screenshots fields'), false);
        }
    }
    else if (file.fieldname === 'templateFile') {
        // ZIP files allowed
        if (fileExtension === 'zip') {
            cb(null, true);
        }
        else {
            cb(new Error('Only ZIP files are allowed for templateFile field'), false);
        }
    }
    else {
        cb(new Error(`Unexpected field: ${file.fieldname}`), false);
    }
};
// Combined template upload middleware for Cloudinary
exports.uploadTemplateFilesCloudinary = (0, multer_1.default)({
    storage: cloudinaryStorage,
    fileFilter: fileFilter,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'templateFile', maxCount: 1 },
    { name: 'screenshots', maxCount: 10 }
]);
// Blog upload middleware for Cloudinary
exports.uploadBlogFilesCloudinary = (0, multer_1.default)({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
        const fileExtension = file.originalname.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'contentImages', maxCount: 20 }
]);
// User profile upload middleware for Cloudinary
exports.uploadUserProfileCloudinary = (0, multer_1.default)({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
        const fileExtension = file.originalname.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('image');
// Category image upload middleware for Cloudinary
exports.uploadCategoryImageCloudinary = (0, multer_1.default)({
    storage: cloudinaryStorage,
    fileFilter: (req, file, cb) => {
        const fileExtension = file.originalname.toLowerCase().split('.').pop();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'), false);
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
}).single('image');
