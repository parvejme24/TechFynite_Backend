"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
exports.restrictBlogModification = restrictBlogModification;
exports.adminOrSuperAdminOnly = adminOrSuperAdminOnly;
exports.superAdminOnly = superAdminOnly;
exports.ownerOnly = ownerOnly;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
function authMiddleware(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.userId = payload.userId;
        req.user = payload;
        next();
    }
    catch (e) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
function restrictBlogModification(req, res, next) {
    return res.status(403).json({ error: "Not allowed" });
}
function adminOrSuperAdminOnly(req, res, next) {
    const user = req.user;
    // Check for both uppercase and lowercase role values
    const userRole = user?.role?.toUpperCase();
    if (!user || (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN")) {
        return res.status(403).json({ error: "Admins or Super Admins only" });
    }
    next();
}
function superAdminOnly(req, res, next) {
    const user = req.user;
    if (!user || user.role !== "SUPER_ADMIN") {
        return res.status(403).json({ error: "Admins only" });
    }
    next();
}
function ownerOnly(req, res, next) {
    const userIdFromToken = req.userId;
    const userIdFromParams = req.params.userId;
    if (!userIdFromToken || userIdFromToken !== userIdFromParams) {
        return res.status(403).json({ error: 'Access denied: not the owner' });
    }
    next();
}
