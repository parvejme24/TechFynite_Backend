"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.logout = exports.resetPassword = exports.resetPasswordRequest = exports.refreshToken = exports.verifyOtp = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.register(req.body);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.login(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.login = login;
const verifyOtp = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.verifyOtp(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.verifyOtp = verifyOtp;
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await auth_service_1.AuthService.refreshToken(refreshToken);
        res.json(result);
    }
    catch (error) {
        res.status(401).json({ error: error.message });
    }
};
exports.refreshToken = refreshToken;
const resetPasswordRequest = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await auth_service_1.AuthService.resetPasswordRequest(email);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.resetPasswordRequest = resetPasswordRequest;
const resetPassword = async (req, res) => {
    try {
        const result = await auth_service_1.AuthService.resetPassword(req.body);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.resetPassword = resetPassword;
const logout = async (req, res) => {
    try {
        // Assume userId is available in req.user (set by auth middleware)
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const result = await auth_service_1.AuthService.logout(userId);
        res.json(result);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.logout = logout;
const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await auth_service_1.AuthService.getCurrentUser(userId);
        res.json({ user });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getCurrentUser = getCurrentUser;
