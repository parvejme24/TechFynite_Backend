"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminAndCheckStatus = exports.authenticateAndCheckStatus = exports.checkUserStatus = exports.optionalAuth = exports.requireAdmin = exports.authenticateUser = void 0;
const auth_service_1 = require("../module/auth/auth.service");
const authenticateUser = async (req, res, next) => {
    try {
        let nextAuthSecret = req.headers['x-nextauth-secret'] || req.body?.nextAuthSecret;
        if (!nextAuthSecret) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                nextAuthSecret = authHeader.slice('Bearer '.length);
            }
        }
        if (!nextAuthSecret) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "NextAuth secret not provided"
            });
        }
        const sessionValidation = await auth_service_1.authService.validateSession(nextAuthSecret);
        if (!sessionValidation.isValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session",
                error: sessionValidation.error
            });
        }
        req.user = sessionValidation.user;
        next();
        return;
    }
    catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: "Internal server error"
        });
    }
};
exports.authenticateUser = authenticateUser;
const requireAdmin = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "User not authenticated"
            });
        }
        if (user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: "Admin access required",
                error: "Insufficient permissions"
            });
        }
        next();
        return;
    }
    catch (error) {
        console.error("Error in admin authorization middleware:", error);
        return res.status(500).json({
            success: false,
            message: "Authorization error",
            error: "Internal server error"
        });
    }
};
exports.requireAdmin = requireAdmin;
const optionalAuth = async (req, res, next) => {
    try {
        let nextAuthSecret = req.headers['x-nextauth-secret'] || req.body?.nextAuthSecret;
        if (!nextAuthSecret) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                nextAuthSecret = authHeader.slice('Bearer '.length);
            }
        }
        if (nextAuthSecret) {
            const sessionValidation = await auth_service_1.authService.validateSession(nextAuthSecret);
            if (sessionValidation.isValid) {
                req.user = sessionValidation.user;
            }
        }
        next();
        return;
    }
    catch (error) {
        console.error("Error in optional authentication middleware:", error);
        next();
        return;
    }
};
exports.optionalAuth = optionalAuth;
const checkUserStatus = (req, res, next) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "User not authenticated"
            });
        }
        if (user.isBanned) {
            return res.status(403).json({
                success: false,
                message: "Account is banned",
                error: "Account access denied"
            });
        }
        if (user.isTrashed) {
            return res.status(403).json({
                success: false,
                message: "Account is deleted",
                error: "Account access denied"
            });
        }
        if (user.isDeletedPermanently) {
            return res.status(403).json({
                success: false,
                message: "Account is permanently deleted",
                error: "Account access denied"
            });
        }
        next();
        return;
    }
    catch (error) {
        console.error("Error in user status middleware:", error);
        return res.status(500).json({
            success: false,
            message: "User status check error",
            error: "Internal server error"
        });
    }
};
exports.checkUserStatus = checkUserStatus;
exports.authenticateAndCheckStatus = [
    exports.authenticateUser,
    exports.checkUserStatus
];
exports.authenticateAdminAndCheckStatus = [
    exports.authenticateUser,
    exports.checkUserStatus,
    exports.requireAdmin
];
//# sourceMappingURL=authMiddleware.js.map