"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const auth_model_1 = require("./auth.model");
const auth_utils_1 = require("./auth.utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;
exports.AuthService = {
    register: async (data) => {
        const existing = await auth_model_1.AuthModel.findByEmail(data.email);
        if (existing)
            throw new Error('Email already registered');
        const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
        const user = await auth_model_1.AuthModel.create({
            ...data,
            password: hashedPassword,
            isVerified: true, // Auto-verify users
        });
        return { message: 'Registration successful' };
    },
    login: async (data) => {
        const user = await auth_model_1.AuthModel.findByEmail(data.email);
        if (!user)
            throw new Error('Invalid credentials');
        const valid = await bcryptjs_1.default.compare(data.password, user.password);
        if (!valid)
            throw new Error('Invalid credentials');
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, auth_utils_1.signJwt)(payload);
        const refreshToken = (0, auth_utils_1.signRefreshToken)(payload);
        await auth_model_1.AuthModel.update(user.id, { refreshToken });
        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                displayName: user.displayName,
                email: user.email,
                photoUrl: user.photoUrl,
                designation: user.designation,
                role: user.role,
                phone: user.phone,
                country: user.country,
                city: user.city,
                stateOrRegion: user.stateOrRegion,
                postCode: user.postCode,
                balance: user.balance,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        };
    },
    refreshToken: async (token) => {
        // Validate refresh token and issue new access token
        const payload = (0, auth_utils_1.verifyRefreshToken)(token);
        if (!payload)
            throw new Error('Invalid refresh token');
        const user = await auth_model_1.AuthModel.findById(payload.userId);
        if (!user || user.refreshToken !== token)
            throw new Error('Invalid refresh token');
        const newAccessToken = (0, auth_utils_1.signJwt)({ userId: user.id, email: user.email, role: user.role });
        return { accessToken: newAccessToken };
    },
    resetPasswordRequest: async (email) => {
        const user = await auth_model_1.AuthModel.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        const otp = (0, auth_utils_1.generateOtp)();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await auth_model_1.AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
        await (0, auth_utils_1.sendEmail)(email, 'Reset your password', `Your password reset code is: ${otp}\n\nReset here:\nhttp://localhost:3000/otp\nhttps://tf-f-ts.vercel.app/otp`);
        return { message: 'Password reset code sent to email.' };
    },
    resetPassword: async (data) => {
        const user = await auth_model_1.AuthModel.findByEmail(data.email);
        if (!user)
            throw new Error('User not found');
        if (user.otpCode !== data.otp)
            throw new Error('Invalid OTP');
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
            throw new Error('OTP expired');
        const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
        await auth_model_1.AuthModel.update(user.id, { password: hashedPassword, otpCode: null, otpExpiresAt: null });
        return { message: 'Password reset successful' };
    },
    logout: async (userId) => {
        await auth_model_1.AuthModel.update(userId, { refreshToken: null });
        return { message: 'Logged out successfully' };
    },
    getCurrentUser: async (userId) => {
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        return {
            id: user.id,
            displayName: user.displayName,
            email: user.email,
            photoUrl: user.photoUrl,
            designation: user.designation,
            role: user.role,
            phone: user.phone,
            country: user.country,
            city: user.city,
            stateOrRegion: user.stateOrRegion,
            postCode: user.postCode,
            balance: user.balance,
            isVerified: user.isVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    },
};
