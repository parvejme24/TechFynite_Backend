"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.EMAIL_FROM = exports.SMTP_PASS = exports.SMTP_USER = exports.SMTP_PORT = exports.SMTP_HOST = exports.PORT = exports.FRONTEND_URL = exports.BCRYPT_ROUNDS = exports.DATABASE_URL = void 0;
exports.DATABASE_URL = process.env.DATABASE_URL || "";
exports.BCRYPT_ROUNDS = process.env.BCRYPT_ROUNDS || 12;
exports.FRONTEND_URL = process.env.FRONTEND_URL || "";
exports.PORT = process.env.PORT || 3000;
exports.SMTP_HOST = process.env.SMTP_HOST || "";
exports.SMTP_PORT = process.env.SMTP_PORT || "";
exports.SMTP_USER = process.env.SMTP_USER || "";
exports.SMTP_PASS = process.env.SMTP_PASS || "";
exports.EMAIL_FROM = process.env.EMAIL_FROM || "";
exports.CLOUD_NAME = process.env.CLOUD_NAME || "";
exports.API_KEY = process.env.API_KEY || "";
exports.API_SECRET = process.env.API_SECRET || "";
//# sourceMappingURL=secret.js.map