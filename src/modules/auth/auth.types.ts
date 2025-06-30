export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
  // Optionally add more fields as needed
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
} 