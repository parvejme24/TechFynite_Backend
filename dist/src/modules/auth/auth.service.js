"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    register: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const existing = yield auth_model_1.AuthModel.findByEmail(data.email);
        if (existing)
            throw new Error('Email already registered');
        const hashedPassword = yield bcryptjs_1.default.hash(data.password, 10);
        const otp = (0, auth_utils_1.generateOtp)();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        const user = yield auth_model_1.AuthModel.create(Object.assign(Object.assign({}, data), { password: hashedPassword, otpCode: otp, otpExpiresAt, isVerified: false }));
        yield (0, auth_utils_1.sendEmail)(data.email, 'Verify your email', `Your verification code is: ${otp}`);
        return { message: 'Registration successful, please verify your email.' };
    }),
    login: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield auth_model_1.AuthModel.findByEmail(data.email);
        if (!user)
            throw new Error('Invalid credentials');
        if (!user.isVerified)
            throw new Error('Email not verified');
        const valid = yield bcryptjs_1.default.compare(data.password, user.password);
        if (!valid)
            throw new Error('Invalid credentials');
        const payload = { userId: user.id, email: user.email, role: user.role };
        const accessToken = (0, auth_utils_1.signJwt)(payload);
        const refreshToken = (0, auth_utils_1.signRefreshToken)(payload);
        yield auth_model_1.AuthModel.update(user.id, { refreshToken });
        return { accessToken, refreshToken };
    }),
    verifyOtp: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield auth_model_1.AuthModel.findByEmail(data.email);
        if (!user)
            throw new Error('User not found');
        if (user.isVerified)
            return { message: 'Already verified' };
        if (user.otpCode !== data.otp)
            throw new Error('Invalid OTP');
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
            throw new Error('OTP expired');
        yield auth_model_1.AuthModel.update(user.id, { isVerified: true, otpCode: null, otpExpiresAt: null });
        return { message: 'Email verified successfully' };
    }),
    refreshToken: (token) => __awaiter(void 0, void 0, void 0, function* () {
        // Validate refresh token and issue new access token
        const payload = (0, auth_utils_1.verifyRefreshToken)(token);
        if (!payload)
            throw new Error('Invalid refresh token');
        const user = yield auth_model_1.AuthModel.findById(payload.userId);
        if (!user || user.refreshToken !== token)
            throw new Error('Invalid refresh token');
        const newAccessToken = (0, auth_utils_1.signJwt)({ userId: user.id, email: user.email, role: user.role });
        return { accessToken: newAccessToken };
    }),
    resetPasswordRequest: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield auth_model_1.AuthModel.findByEmail(email);
        if (!user)
            throw new Error('User not found');
        const otp = (0, auth_utils_1.generateOtp)();
        const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
        yield auth_model_1.AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
        yield (0, auth_utils_1.sendEmail)(email, 'Reset your password', `Your password reset code is: ${otp}`);
        return { message: 'Password reset code sent to email.' };
    }),
    resetPassword: (data) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield auth_model_1.AuthModel.findByEmail(data.email);
        if (!user)
            throw new Error('User not found');
        if (user.otpCode !== data.otp)
            throw new Error('Invalid OTP');
        if (!user.otpExpiresAt || user.otpExpiresAt < new Date())
            throw new Error('OTP expired');
        const hashedPassword = yield bcryptjs_1.default.hash(data.newPassword, 10);
        yield auth_model_1.AuthModel.update(user.id, { password: hashedPassword, otpCode: null, otpExpiresAt: null });
        return { message: 'Password reset successful' };
    }),
    logout: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        yield auth_model_1.AuthModel.update(userId, { refreshToken: null });
        return { message: 'Logged out successfully' };
    }),
};
