import { AuthModel } from './auth.model';
import { RegisterRequest, LoginRequest, VerifyOtpRequest, ResetPasswordRequest, JwtPayload } from './auth.types';
import { signJwt, signRefreshToken, verifyRefreshToken, generateOtp, sendEmail } from './auth.utils';
import bcrypt from 'bcryptjs';

const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES) || 10;

export const AuthService = {
  register: async (data: RegisterRequest) => {
    const existing = await AuthModel.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const user = await AuthModel.create({
      ...data,
      password: hashedPassword,
      otpCode: otp,
      otpExpiresAt,
      isVerified: false,
    } as any);
    await sendEmail(data.email, 'Verify your email', `Your verification code is: ${otp}`);
    return { message: 'Registration successful, please verify your email.' };
  },

  login: async (data: LoginRequest) => {
    const user = await AuthModel.findByEmail(data.email);
    if (!user) throw new Error('Invalid credentials');
    if (!user.isVerified) throw new Error('Email not verified');
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    const payload: JwtPayload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = signJwt(payload);
    const refreshToken = signRefreshToken(payload);
    await AuthModel.update(user.id, { refreshToken });
    return { accessToken, refreshToken };
  },

  verifyOtp: async (data: VerifyOtpRequest) => {
    const user = await AuthModel.findByEmail(data.email);
    if (!user) throw new Error('User not found');
    if (user.isVerified) return { message: 'Already verified' };
    if (user.otpCode !== data.otp) throw new Error('Invalid OTP');
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) throw new Error('OTP expired');
    await AuthModel.update(user.id, { isVerified: true, otpCode: null, otpExpiresAt: null });
    return { message: 'Email verified successfully' };
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
    await sendEmail(email, 'Reset your password', `Your password reset code is: ${otp}`);
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
}; 