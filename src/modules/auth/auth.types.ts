export interface RegisterRequest {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    displayName: string;
    email: string;
    photoUrl: string | null;
    designation: string | null;
    role: string;
    phone: string | null;
    country: string | null;
    city: string | null;
    stateOrRegion: string | null;
    postCode: string | null;
    balance: number;
    isVerified: boolean | null;
    createdAt: Date;
    updatedAt: Date;
  };
} 