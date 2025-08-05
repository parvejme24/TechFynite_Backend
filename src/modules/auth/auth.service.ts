import { AuthModel } from './auth.model';
import { RegisterRequest, LoginRequest, ResetPasswordRequest, JwtPayload, LoginResponse } from './auth.types';
import { signJwt, signRefreshToken, verifyRefreshToken, generateOtp, sendEmail } from './auth.utils';
import bcrypt from 'bcryptjs';

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;

export const AuthService = {
  register: async (data: RegisterRequest) => {
    const existing = await AuthModel.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await AuthModel.create({
      ...data,
      password: hashedPassword,
      isVerified: true, // Auto-verify users
    });
    return { message: 'Registration successful' };
  },

  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const user = await AuthModel.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signJwt(payload);
    const refreshToken = signRefreshToken(payload);
    await AuthModel.update(user.id, { refreshToken });
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

  refreshToken: async (token: string) => {
    // Validate refresh token and issue new access token
    const payload = verifyRefreshToken(token);
    if (!payload) throw new Error('Invalid refresh token');
    const user = await AuthModel.findById(payload.userId);
    if (!user || user.refreshToken !== token) throw new Error('Invalid refresh token');
    const newAccessToken = signJwt({ userId: user.id, email: user.email, role: user.role });
    return { accessToken: newAccessToken };
  },

  resetPasswordRequest: async (email: string) => {
    const user = await AuthModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
    await sendEmail(
      email,
      'Reset your password',
      `Your password reset code is: ${otp}\n\nReset here:\nhttp://localhost:3000/otp\nhttps://tf-f-ts.vercel.app/otp`
    );
    return { message: 'Password reset code sent to email.' };
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const user = await AuthModel.findByEmail(data.email);
    if (!user) throw new Error('User not found');
    if (user.otpCode !== data.otp) throw new Error('Invalid OTP');
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) throw new Error('OTP expired');
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    await AuthModel.update(user.id, { password: hashedPassword, otpCode: null, otpExpiresAt: null });
    return { message: 'Password reset successful' };
  },

  logout: async (userId: string) => {
    await AuthModel.update(userId, { refreshToken: null });
    return { message: 'Logged out successfully' };
  },

  getCurrentUser: async (userId: string) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
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

  verifyEmail: async (email: string, otpCode: string) => {
    const user = await AuthModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    if (user.otpCode !== otpCode) throw new Error('Invalid OTP');
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) throw new Error('OTP expired');
    
    await AuthModel.update(user.id, { 
      isVerified: true, 
      otpCode: null, 
      otpExpiresAt: null 
    });
    
    return { message: 'Email verified successfully' };
  },

  resendVerificationEmail: async (email: string) => {
    const user = await AuthModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    if (user.isVerified) throw new Error('Email already verified');
    
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    await AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
    await sendEmail(
      email,
      'Verify your email',
      `Your email verification code is: ${otp}\n\nVerify here:\nhttp://localhost:3000/verify\nhttps://tf-f-ts.vercel.app/verify`
    );
    
    return { message: 'Verification email sent successfully' };
  },

  forgotPassword: async (email: string) => {
    const user = await AuthModel.findByEmail(email);
    if (!user) throw new Error('User not found');
    
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    
    await AuthModel.update(user.id, { otpCode: otp, otpExpiresAt });
    await sendEmail(
      email,
      'Reset your password',
      `Your password reset code is: ${otp}\n\nReset here:\nhttp://localhost:3000/reset-password\nhttps://tf-f-ts.vercel.app/reset-password`
    );
    
    return { message: 'Password reset email sent successfully' };
  },

  updateProfile: async (userId: string, data: any) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const allowedFields = ['displayName', 'phone', 'country', 'city', 'stateOrRegion', 'postCode'];
    const updateData: any = {};
    
    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field];
      }
    }
    
    const updatedUser = await AuthModel.update(userId, updateData);
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

  changePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) throw new Error('Current password is incorrect');
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AuthModel.update(userId, { password: hashedPassword });
    
    return { message: 'Password changed successfully' };
  },

  updateProfilePhoto: async (userId: string, photoUrl: string) => {
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = await AuthModel.update(userId, { photoUrl });
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

  getAllUsers: async (params: { page: number; limit: number; search?: string; role?: string }) => {
    const { page, limit, search, role } = params;
    const skip = (page - 1) * limit;
    
    const where: any = {};
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
      AuthModel.findMany(where, { skip, take: limit }),
      AuthModel.count(where)
    ]);
    
    return {
      users: users.map((user: any) => ({
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

  updateUserRole: async (adminUserId: string, userId: string, role: string) => {
    const admin = await AuthModel.findById(adminUserId);
    if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
      throw new Error('Insufficient permissions');
    }
    
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = await AuthModel.update(userId, { role: role as any });
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

  updateUserStatus: async (adminUserId: string, userId: string, isVerified: boolean) => {
    const admin = await AuthModel.findById(adminUserId);
    if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
      throw new Error('Insufficient permissions');
    }
    
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    const updatedUser = await AuthModel.update(userId, { isVerified });
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

  deleteUser: async (adminUserId: string, userId: string) => {
    const admin = await AuthModel.findById(adminUserId);
    if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
      throw new Error('Insufficient permissions');
    }
    
    const user = await AuthModel.findById(userId);
    if (!user) throw new Error('User not found');
    
    await AuthModel.delete(userId);
    return { message: 'User deleted successfully' };
  },
}; 