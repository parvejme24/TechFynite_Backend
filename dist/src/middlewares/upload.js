"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.uploadTemplateCategoryImage = exports.uploadBlogCategoryImage = exports.uploadUserProfile = exports.uploadTemplateFiles = exports.uploadTemplateScreenshots = exports.uploadTemplateFile = exports.uploadBlogFiles = exports.uploadBlogContentImage = exports.uploadBlogThumbnail = exports.uploadTemplateImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure upload directories exist
const uploadDirs = [
    'uploads/templateImage',
    'uploads/blogThumbnail',
    'uploads/blogContentImage',
    'uploads/templateFile',
    'uploads/templateScreenshots',
    'uploads/userProfile',
    'uploads/blogCategoryImage',
    'uploads/templateCategoryImage'
];
uploadDirs.forEach(dir => {
    const fullPath = path_1.default.join(__dirname, '../../', dir);
    if (!fs_1.default.existsSync(fullPath)) {
        fs_1.default.mkdirSync(fullPath, { recursive: true });
    }
});
// Base storage configuration
const createStorage = (destination) => multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, '../../', destination));
    },
    filename: function (req, file, cb) {
        const ext = path_1.default.extname(file.originalname);
        const base = path_1.default.basename(file.originalname, ext);
        cb(null, `${base}-${Date.now()}${ext}`);
    },
});
// File filter for different upload types
const createFileFilter = (allowedTypes) => (req, file, cb) => {
    const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Only ${allowedTypes.join(', ')} files are allowed`), false);
    }
};
// Template image upload (images only)
exports.uploadTemplateImage = (0, multer_1.default)({
    storage: createStorage('uploads/templateImage'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Blog thumbnail upload (images only)
exports.uploadBlogThumbnail = (0, multer_1.default)({
    storage: createStorage('uploads/blogThumbnail'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Blog content image upload (images only)
exports.uploadBlogContentImage = (0, multer_1.default)({
    storage: createStorage('uploads/blogContentImage'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
// Combined blog upload middleware
exports.uploadBlogFiles = (0, multer_1.default)({
    storage: createStorage('uploads'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'contentImages', maxCount: 20 }
]);
// Template file upload (zip files only)
exports.uploadTemplateFile = (0, multer_1.default)({
    storage: createStorage('uploads/templateFile'),
    fileFilter: createFileFilter(['.zip']),
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});
// Template screenshots upload (images only)
exports.uploadTemplateScreenshots = (0, multer_1.default)({
    storage: createStorage('uploads/templateScreenshots'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Combined template upload middleware
exports.uploadTemplateFiles = (0, multer_1.default)({
    storage: createStorage('uploads'),
    fileFilter: (req, file, cb) => {
        const fileExtension = path_1.default.extname(file.originalname).toLowerCase();
        // Check field name to determine allowed file types
        if (file.fieldname === 'image' || file.fieldname === 'screenshots') {
            // Images allowed
            if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed for image and screenshots fields'), false);
            }
        }
        else if (file.fieldname === 'templateFile') {
            // ZIP files allowed
            if (fileExtension === '.zip') {
                cb(null, true);
            }
            else {
                cb(new Error('Only ZIP files are allowed for templateFile field'), false);
            }
        }
        else {
            cb(new Error(`Unexpected field: ${file.fieldname}`), false);
        }
    },
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'templateFile', maxCount: 1 },
    { name: 'screenshots', maxCount: 10 }
]);
// User profile upload (images only)
exports.uploadUserProfile = (0, multer_1.default)({
    storage: createStorage('uploads/userProfile'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 2 * 1024 * 1024 } // 2MB
});
// Blog category image upload (images only)
exports.uploadBlogCategoryImage = (0, multer_1.default)({
    storage: createStorage('uploads/blogCategoryImage'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// Template category image upload (images only)
exports.uploadTemplateCategoryImage = (0, multer_1.default)({
    storage: createStorage('uploads/templateCategoryImage'),
    fileFilter: createFileFilter(['.jpg', '.jpeg', '.png', '.gif', '.webp']),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});
// General upload (for backward compatibility)
exports.upload = (0, multer_1.default)({
    storage: createStorage('uploads'),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
