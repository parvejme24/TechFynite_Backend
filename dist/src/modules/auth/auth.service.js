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
    verifyEmail: async (email, otpCode) => {
        const user = await auth_model_1.AuthModel.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        if (user.otpCode !== otpCode)
            throw new Error('Invalid OTP');
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
            throw new Error('OTP expired');
        await auth_model_1.AuthModel.update(user.id, {
            isVerified: true,
            otpCode: null,
            otpExpiresAt: null
        });
        return { message: 'Email verified successfully' };
    },
    resendVerificationEmail: async (email) => {
        const user = await auth_model_1.AuthModel.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        if (user.isVerified)
            throw new Error('Email already verified');
        const otp = (0, auth_utils_1.generateOtp)();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await auth_model_1.AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
        await (0, auth_utils_1.sendEmail)(email, 'Verify your email', `Your email verification code is: ${otp}\n\nVerify here:\nhttp://localhost:3000/verify\nhttps://tf-f-ts.vercel.app/verify`);
        return { message: 'Verification email sent successfully' };
    },
    forgotPassword: async (email) => {
        const user = await auth_model_1.AuthModel.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        const otp = (0, auth_utils_1.generateOtp)();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        await auth_model_1.AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
        await (0, auth_utils_1.sendEmail)(email, 'Reset your password', `Your password reset code is: ${otp}\n\nReset here:\nhttp://localhost:3000/reset-password\nhttps://tf-f-ts.vercel.app/reset-password`);
        return { message: 'Password reset email sent successfully' };
    },
    updateProfile: async (userId, data) => {
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        const allowedFields = ['displayName', 'phone', 'country', 'city', 'stateOrRegion', 'postCode'];
        const updateData = {};
        for (const field of allowedFields) {
            if (data[field] !== undefined) {
                updateData[field] = data[field];
            }
        }
        const updatedUser = await auth_model_1.AuthModel.update(userId, updateData);
        return {
            id: updatedUser.id,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            photoUrl: updatedUser.photoUrl,
            designation: updatedUser.designation,
            role: updatedUser.role,
            phone: updatedUser.phone,
            country: updatedUser.country,
            city: updatedUser.city,
            stateOrRegion: updatedUser.stateOrRegion,
            postCode: updatedUser.postCode,
            balance: updatedUser.balance,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    },
    changePassword: async (userId, currentPassword, newPassword) => {
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        const valid = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!valid)
            throw new Error('Current password is incorrect');
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await auth_model_1.AuthModel.update(userId, { password: hashedPassword });
        return { message: 'Password changed successfully' };
    },
    updateProfilePhoto: async (userId, photoUrl) => {
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        const updatedUser = await auth_model_1.AuthModel.update(userId, { photoUrl });
        return {
            id: updatedUser.id,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            photoUrl: updatedUser.photoUrl,
            designation: updatedUser.designation,
            role: updatedUser.role,
            phone: updatedUser.phone,
            country: updatedUser.country,
            city: updatedUser.city,
            stateOrRegion: updatedUser.stateOrRegion,
            postCode: updatedUser.postCode,
            balance: updatedUser.balance,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    },
    getAllUsers: async (params) => {
        const { page, limit, search, role } = params;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { displayName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }
        if (role) {
            where.role = role;
        }
        const [users, total] = await Promise.all([
            auth_model_1.AuthModel.findMany(where, { skip, take: limit }),
            auth_model_1.AuthModel.count(where)
        ]);
        return {
            users: users.map((user) => ({
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
            })),
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        };
    },
    updateUserRole: async (adminUserId, userId, role) => {
        const admin = await auth_model_1.AuthModel.findById(adminUserId);
        if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
            throw new Error('Insufficient permissions');
        }
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        const updatedUser = await auth_model_1.AuthModel.update(userId, { role: role });
        return {
            id: updatedUser.id,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            photoUrl: updatedUser.photoUrl,
            designation: updatedUser.designation,
            role: updatedUser.role,
            phone: updatedUser.phone,
            country: updatedUser.country,
            city: updatedUser.city,
            stateOrRegion: updatedUser.stateOrRegion,
            postCode: updatedUser.postCode,
            balance: updatedUser.balance,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    },
    updateUserStatus: async (adminUserId, userId, isVerified) => {
        const admin = await auth_model_1.AuthModel.findById(adminUserId);
        if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
            throw new Error('Insufficient permissions');
        }
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        const updatedUser = await auth_model_1.AuthModel.update(userId, { isVerified });
        return {
            id: updatedUser.id,
            displayName: updatedUser.displayName,
            email: updatedUser.email,
            photoUrl: updatedUser.photoUrl,
            designation: updatedUser.designation,
            role: updatedUser.role,
            phone: updatedUser.phone,
            country: updatedUser.country,
            city: updatedUser.city,
            stateOrRegion: updatedUser.stateOrRegion,
            postCode: updatedUser.postCode,
            balance: updatedUser.balance,
            isVerified: updatedUser.isVerified,
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt
        };
    },
    deleteUser: async (adminUserId, userId) => {
        const admin = await auth_model_1.AuthModel.findById(adminUserId);
        if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
            throw new Error('Insufficient permissions');
        }
        const user = await auth_model_1.AuthModel.findById(userId);
        if (!user)
            throw new Error('User not found');
        await auth_model_1.AuthModel.delete(userId);
        return { message: 'User deleted successfully' };
    },
};
