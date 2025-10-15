"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdminAndCheckStatus = exports.authenticateAndCheckStatus = exports.checkUserStatus = exports.optionalAuth = exports.requireAdmin = exports.authenticateUser = void 0;
const auth_service_1 = require("../module/auth/auth.service");
const authenticateUser = async (req, res, next) => {
    try {
        console.log('🔐 Authenticating user...');
        let nextAuthSecret = req.headers['x-nextauth-secret'] || req.body?.nextAuthSecret;
        if (!nextAuthSecret) {
            const authHeader = req.headers['authorization'];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                nextAuthSecret = authHeader.slice('Bearer '.length);
            }
        }
        if (!nextAuthSecret) {
            console.log('❌ No authentication token provided');
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "NextAuth secret not provided"
            });
        }
        console.log('🔍 Validating session...');
        const sessionValidation = await auth_service_1.authService.validateSession(nextAuthSecret);
        if (!sessionValidation.isValid) {
            console.log('❌ Invalid session:', sessionValidation.error);
            return res.status(401).json({
                success: false,
                message: "Invalid or expired session",
                error: sessionValidation.error
            });
        }
        console.log('✅ User authenticated:', { userId: sessionValidation.user?.id, role: sessionValidation.user?.role });
        req.user = sessionValidation.user;
        next();
        return;
    }
    catch (error) {
        console.error("❌ Error in authentication middleware:", error);
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
            console.log('❌ Admin check failed: User not authenticated');
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "User not authenticated"
            });
        }
        console.log('🔍 Checking admin role for user:', { userId: user.id, role: user.role });
        if (user.role !== 'ADMIN') {
            console.log('❌ Admin check failed: Insufficient permissions');
            return res.status(403).json({
                success: false,
                message: "Admin access required",
                error: "Insufficient permissions"
            });
        }
        console.log('✅ Admin access granted');
        next();
        return;
    }
    catch (error) {
        console.error("❌ Error in admin authorization middleware:", error);
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
            console.log('❌ User status check failed: User not authenticated');
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "User not authenticated"
            });
        }
        console.log('🔍 Checking user status:', {
            userId: user.id,
            isBanned: user.isBanned,
            isTrashed: user.isTrashed,
            isDeletedPermanently: user.isDeletedPermanently
        });
        if (user.isBanned) {
            console.log('❌ User status check failed: Account is banned');
            return res.status(403).json({
                success: false,
                message: "Account is banned",
                error: "Account access denied"
            });
        }
        if (user.isTrashed) {
            console.log('❌ User status check failed: Account is deleted');
            return res.status(403).json({
                success: false,
                message: "Account is deleted",
                error: "Account access denied"
            });
        }
        if (user.isDeletedPermanently) {
            console.log('❌ User status check failed: Account is permanently deleted');
            return res.status(403).json({
                success: false,
                message: "Account is permanently deleted",
                error: "Account access denied"
            });
        }
        console.log('✅ User status check passed');
        next();
        return;
    }
    catch (error) {
        console.error("❌ Error in user status middleware:", error);
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