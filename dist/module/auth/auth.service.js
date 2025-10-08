"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const email_1 = require("../../utils/email");
const prisma = new client_1.PrismaClient();
class AuthService {
    generateNextAuthSecret() {
        return crypto_1.default.randomBytes(32).toString("hex");
    }
    generateSessionExpiration() {
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        return expiration;
    }
    async registerUser(data) {
        try {
            const existingUser = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                return {
                    success: false,
                    message: "User with this email already exists",
                    error: "Email already registered",
                };
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 12);
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            const nextAuthSecret = data.clientToken || null;
            const sessionExpiration = nextAuthSecret
                ? this.generateSessionExpiration()
                : null;
            const user = await prisma.user.create({
                data: {
                    fullName: data.fullName,
                    email: data.email,
                    password: hashedPassword,
                    nextAuthSecret,
                    nextAuthExpiresAt: sessionExpiration,
                    isLoggedIn: false,
                    lastLoginAt: null,
                    provider: "email",
                },
                include: {
                    profile: true,
                },
            });
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpCode: otp,
                    otpPurpose: client_1.OtpPurpose.REGISTRATION,
                    otpExpiresAt: otpExpiresAt,
                    otpVerified: false,
                },
            });
            try {
                await (0, email_1.sendOtpEmail)(user.email, otp);
            }
            catch (err) {
                console.error("Failed to send OTP email:", err);
            }
            return {
                success: true,
                message: "User registered successfully. Please verify the OTP sent to your email.",
                data: {
                    user: user,
                    nextAuthSecret: nextAuthSecret || undefined,
                    expiresAt: sessionExpiration || undefined,
                },
            };
        }
        catch (error) {
            console.error("Error registering user:", error);
            return {
                success: false,
                message: "Failed to register user",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async loginUser(data) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email },
                include: { profile: true },
            });
            if (!user) {
                return {
                    success: false,
                    message: "Invalid email or password",
                    error: "User not found",
                };
            }
            if (user.isBanned || user.isTrashed || user.isDeletedPermanently) {
                return {
                    success: false,
                    message: "Account is disabled",
                    error: "Account not accessible",
                };
            }
            if (!user.password) {
                return {
                    success: false,
                    message: "Please use Google login for this account",
                    error: "OAuth account",
                };
            }
            if (!user.otpVerified) {
                return {
                    success: false,
                    message: "Please verify OTP sent to your email before logging in",
                    error: "OTP not verified",
                };
            }
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: "Invalid email or password",
                    error: "Invalid password",
                };
            }
            const nextAuthSecret = data.clientToken || this.generateNextAuthSecret();
            const sessionExpiration = this.generateSessionExpiration();
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: {
                    nextAuthSecret,
                    nextAuthExpiresAt: sessionExpiration,
                    isLoggedIn: true,
                    lastLoginAt: new Date(),
                },
                include: { profile: true },
            });
            return {
                success: true,
                message: "Login successful",
                data: {
                    user: updatedUser,
                    nextAuthSecret,
                    expiresAt: sessionExpiration,
                },
            };
        }
        catch (error) {
            console.error("Error logging in user:", error);
            return {
                success: false,
                message: "Failed to login",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async googleLogin(data) {
        try {
            let user = await prisma.user.findUnique({
                where: { email: data.email },
                include: { profile: true },
            });
            if (user) {
                const nextAuthSecret = this.generateNextAuthSecret();
                const sessionExpiration = this.generateSessionExpiration();
                const updatedUser = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        nextAuthSecret: data.clientToken || nextAuthSecret,
                        nextAuthExpiresAt: sessionExpiration,
                        isLoggedIn: true,
                        lastLoginAt: new Date(),
                        provider: "google",
                        providerId: data.providerId,
                        otpVerified: true,
                    },
                    include: { profile: true },
                });
                return {
                    success: true,
                    message: "Google login successful",
                    data: {
                        user: updatedUser,
                        nextAuthSecret,
                        expiresAt: sessionExpiration,
                    },
                };
            }
            else {
                const nextAuthSecret = this.generateNextAuthSecret();
                const sessionExpiration = this.generateSessionExpiration();
                const newUser = await prisma.user.create({
                    data: {
                        fullName: data.fullName,
                        email: data.email,
                        nextAuthSecret: data.clientToken || nextAuthSecret,
                        nextAuthExpiresAt: sessionExpiration,
                        isLoggedIn: true,
                        lastLoginAt: new Date(),
                        provider: "google",
                        providerId: data.providerId,
                        otpVerified: true,
                    },
                    include: { profile: true },
                });
                if (data.avatarUrl) {
                    await prisma.userProfile.create({
                        data: {
                            userId: newUser.id,
                            avatarUrl: data.avatarUrl,
                        },
                    });
                }
                return {
                    success: true,
                    message: "Google registration and login successful",
                    data: {
                        user: newUser,
                        nextAuthSecret,
                        expiresAt: sessionExpiration,
                    },
                };
            }
        }
        catch (error) {
            console.error("Error with Google login:", error);
            return {
                success: false,
                message: "Failed to login with Google",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async validateSession(nextAuthSecret) {
        try {
            const user = await prisma.user.findFirst({
                where: {
                    nextAuthSecret,
                    isLoggedIn: true,
                    nextAuthExpiresAt: {
                        gt: new Date(),
                    },
                },
                include: { profile: true },
            });
            if (!user) {
                return {
                    isValid: false,
                    error: "Invalid or expired session",
                };
            }
            return {
                isValid: true,
                user: user,
            };
        }
        catch (error) {
            console.error("Error validating session:", error);
            return {
                isValid: false,
                error: "Session validation failed",
            };
        }
    }
    async logoutUser(nextAuthSecret) {
        try {
            const user = await prisma.user.findFirst({
                where: { nextAuthSecret },
            });
            if (!user) {
                return {
                    success: false,
                    message: "Invalid session",
                    error: "User not found",
                };
            }
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    nextAuthSecret: null,
                    nextAuthExpiresAt: null,
                    isLoggedIn: false,
                },
            });
            return {
                success: true,
                message: "Logout successful",
            };
        }
        catch (error) {
            console.error("Error logging out user:", error);
            return {
                success: false,
                message: "Failed to logout",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async verifyOtp(data) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found",
                };
            }
            if (!user.otpCode ||
                !user.otpExpiresAt ||
                user.otpPurpose !== "REGISTRATION") {
                return {
                    success: false,
                    message: "No OTP pending for this user",
                    error: "No OTP",
                };
            }
            if (new Date() > user.otpExpiresAt) {
                return { success: false, message: "OTP expired", error: "OTP expired" };
            }
            if (user.otpCode !== data.otp) {
                return { success: false, message: "Invalid OTP", error: "Invalid OTP" };
            }
            await prisma.user.update({
                where: { id: user.id },
                data: {
                    otpVerified: true,
                    otpCode: null,
                    otpPurpose: null,
                    otpExpiresAt: null,
                },
            });
            return { success: true, message: "OTP verified successfully" };
        }
        catch (error) {
            console.error("Error verifying OTP:", error);
            return {
                success: false,
                message: "Failed to verify OTP",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async resendOtp(data) {
        try {
            const user = await prisma.user.findUnique({
                where: { email: data.email },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found",
                };
            }
            if (user.otpVerified) {
                return {
                    success: false,
                    message: "User already verified",
                    error: "Already verified",
                };
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await prisma.user.update({
                where: { id: user.id },
                data: { otpCode: otp, otpPurpose: "REGISTRATION", otpExpiresAt },
            });
            try {
                await (0, email_1.sendOtpEmail)(user.email, otp);
            }
            catch (err) {
                console.error("Failed to send OTP email:", err);
            }
            return { success: true, message: "OTP resent successfully" };
        }
        catch (error) {
            console.error("Error resending OTP:", error);
            return {
                success: false,
                message: "Failed to resend OTP",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async changePassword(userId, data) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user || !user.password) {
                return {
                    success: false,
                    message: "User not found or no password set",
                    error: "Invalid user",
                };
            }
            const isCurrentPasswordValid = await bcryptjs_1.default.compare(data.currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return {
                    success: false,
                    message: "Current password is incorrect",
                    error: "Invalid current password",
                };
            }
            const hashedNewPassword = await bcryptjs_1.default.hash(data.newPassword, 12);
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedNewPassword },
            });
            return {
                success: true,
                message: "Password changed successfully",
            };
        }
        catch (error) {
            console.error("Error changing password:", error);
            return {
                success: false,
                message: "Failed to change password",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async updateProfile(userId, data) {
        try {
            const existingProfile = await prisma.userProfile.findUnique({
                where: { userId },
            });
            let profile;
            if (existingProfile) {
                profile = await prisma.userProfile.update({
                    where: { userId },
                    data,
                });
            }
            else {
                profile = await prisma.userProfile.create({
                    data: {
                        userId,
                        ...data,
                    },
                });
            }
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            return {
                success: true,
                message: "Profile updated successfully",
                data: { user: user },
            };
        }
        catch (error) {
            console.error("Error updating profile:", error);
            return {
                success: false,
                message: "Failed to update profile",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async getUserById(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                include: { profile: true },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found",
                };
            }
            return {
                success: true,
                message: "User fetched successfully",
                data: { user: user },
            };
        }
        catch (error) {
            console.error("Error fetching user:", error);
            return {
                success: false,
                message: "Failed to fetch user",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async getAllUsers(query) {
        try {
            const { page = 1, limit = 10, search, role, isBanned, isTrashed, isLoggedIn, sortBy, sortOrder, } = query;
            const skip = (page - 1) * limit;
            const where = {};
            if (search) {
                where.OR = [
                    { fullName: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ];
            }
            if (role)
                where.role = role;
            if (isBanned !== undefined)
                where.isBanned = isBanned;
            if (isTrashed !== undefined)
                where.isTrashed = isTrashed;
            if (isLoggedIn !== undefined)
                where.isLoggedIn = isLoggedIn;
            const orderBy = {};
            if (sortBy && sortOrder) {
                orderBy[sortBy] = sortOrder;
            }
            else {
                orderBy.createdAt = "desc";
            }
            const [users, total] = await Promise.all([
                prisma.user.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy,
                    include: { profile: true },
                }),
                prisma.user.count({ where }),
            ]);
            return {
                users,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1,
                },
            };
        }
        catch (error) {
            console.error("Error fetching users:", error);
            throw error;
        }
    }
    async getUserStats() {
        try {
            const [totalUsers, activeUsers, bannedUsers, trashedUsers, loggedInUsers, usersByRole, recentRegistrations, recentLogins,] = await Promise.all([
                prisma.user.count(),
                prisma.user.count({
                    where: {
                        isBanned: false,
                        isTrashed: false,
                        isDeletedPermanently: false,
                    },
                }),
                prisma.user.count({ where: { isBanned: true } }),
                prisma.user.count({ where: { isTrashed: true } }),
                prisma.user.count({ where: { isLoggedIn: true } }),
                prisma.user.groupBy({
                    by: ["role"],
                    _count: { id: true },
                }),
                prisma.user.count({
                    where: {
                        createdAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                }),
                prisma.user.count({
                    where: {
                        lastLoginAt: {
                            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                        },
                    },
                }),
            ]);
            return {
                totalUsers,
                activeUsers,
                bannedUsers,
                trashedUsers,
                loggedInUsers,
                usersByRole: usersByRole.map((item) => ({
                    role: item.role,
                    count: item._count.id,
                })),
                recentRegistrations,
                recentLogins,
            };
        }
        catch (error) {
            console.error("Error fetching user stats:", error);
            throw error;
        }
    }
    async updateUser(userId, data) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found",
                };
            }
            const updateData = { ...data };
            if (data.password) {
                updateData.password = await bcryptjs_1.default.hash(data.password, 12);
            }
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
                include: { profile: true },
            });
            return {
                success: true,
                message: "User updated successfully",
                data: { user: updatedUser },
            };
        }
        catch (error) {
            console.error("Error updating user:", error);
            return {
                success: false,
                message: "Failed to update user",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
    async deleteUser(userId) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return {
                    success: false,
                    message: "User not found",
                    error: "User not found",
                };
            }
            await prisma.user.update({
                where: { id: userId },
                data: {
                    isTrashed: true,
                    isLoggedIn: false,
                    nextAuthSecret: null,
                    nextAuthExpiresAt: null,
                },
            });
            return {
                success: true,
                message: "User deleted successfully",
            };
        }
        catch (error) {
            console.error("Error deleting user:", error);
            return {
                success: false,
                message: "Failed to delete user",
                error: error instanceof Error ? error.message : "Unknown error",
            };
        }
    }
}
exports.authService = new AuthService();
//# sourceMappingURL=auth.service.js.map