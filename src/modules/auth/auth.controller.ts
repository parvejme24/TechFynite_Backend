import { Request, Response } from "express";
import { AuthService } from "./auth.service";

// Public routes
export const register = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please check your email for verification.',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body);
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: result
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      error: error.message
    });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { email, otpCode } = req.body;
    const result = await AuthService.verifyEmail(email, otpCode);
    res.json({
      success: true,
      message: 'Email verified successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const resendVerificationEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.resendVerificationEmail(email);
    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await AuthService.forgotPassword(email);
    res.json({
      success: true,
      message: 'Password reset email sent successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.resetPassword(req.body);
    res.json({
      success: true,
      message: 'Password reset successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Protected routes
export const logout = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    await AuthService.logout(userId);
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    const user = await AuthService.getCurrentUser(userId);
    res.json({
      success: true,
      data: { user }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    const result = await AuthService.updateProfile(userId, req.body);
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    const { currentPassword, newPassword } = req.body;
    await AuthService.changePassword(userId, currentPassword, newPassword);
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    
    let photoUrl = req.body.photoUrl;
    if (req.file) {
      photoUrl = req.file.path; // Cloudinary URL
    }
    
    const result = await AuthService.updateProfilePhoto(userId, photoUrl);
    res.json({
      success: true,
      message: 'Profile photo updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Admin routes
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, search, role } = req.query;
    const result = await AuthService.getAllUsers({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
      role: role as string
    });
    res.json({
      success: true,
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    const adminUserId = req.user?.userId;
    
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    
    const result = await AuthService.updateUserRole(adminUserId, userId, role);
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;
    const adminUserId = req.user?.userId;
    
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    
    const result = await AuthService.updateUserStatus(adminUserId, userId, isVerified);
    res.json({
      success: true,
      message: 'User status updated successfully',
      data: result
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const adminUserId = req.user?.userId;
    
    if (!adminUserId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized"
      });
    }
    
    await AuthService.deleteUser(adminUserId, userId);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};
