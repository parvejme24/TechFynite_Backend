"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUDINARY_URL = exports.CLOUDINARY_API_SECRET = exports.CLOUDINARY_API_KEY = exports.CLOUDINARY_CLOUD_NAME = exports.EMAIL_FROM = exports.SMTP_PASS = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.PORT = exports.FRONTEND_URL = exports.BCRYPT_ROUNDS = exports.DATABASE_URL = void 0;
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12", 10);
exports.FRONTEND_URL = process.env.FRONTEND_URL || "";
exports.PORT = parseInt(process.env.SERVER_RUNNING_PORT || "3030", 10);
exports.SMTP_HOST = process.env.SMTP_HOST || "";
exports.SMTP_PORT = process.env.SMTP_PORT || "";
exports.SMTP_USER = process.env.SMTP_USER || "";
exports.SMTP_PASS = process.env.SMTP_PASS || "";
exports.EMAIL_FROM = process.env.EMAIL_FROM || "";
exports.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
exports.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
exports.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";
exports.CLOUDINARY_URL = process.env.CLOUDINARY_URL || "";
//# sourceMappingURL=secret.js.map