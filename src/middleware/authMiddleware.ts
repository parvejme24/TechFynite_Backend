import { Request, Response, NextFunction } from "express";
import { authService } from "../module/auth/auth.service";

// Authentication middleware using NextAuth secret
export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔐 Authenticating user...');
    
    // Get NextAuth secret from header, Authorization bearer, or body
    let nextAuthSecret = req.headers['x-nextauth-secret'] as string || req.body?.nextAuthSecret;
    if (!nextAuthSecret) {
      const authHeader = req.headers['authorization'] as string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        nextAuthSecret = authHeader.slice('Bearer '.length);
      }
    }
    
    if (!nextAuthSecret) {
      console.log('❌ No authentication token provided');
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "NextAuth secret not provided"
      });
    }

    console.log('🔍 Validating session...');
    // Validate session
    const sessionValidation = await authService.validateSession(nextAuthSecret);
    
    if (!sessionValidation.isValid) {
      console.log('❌ Invalid session:', sessionValidation.error);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired session",
        error: sessionValidation.error
      });
    }

    console.log('✅ User authenticated:', { userId: sessionValidation.user?.id, role: sessionValidation.user?.role });
    // Add user to request object
    (req as any).user = sessionValidation.user;
    next();
    return;
  } catch (error) {
    console.error("❌ Error in authentication middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
      error: "Internal server error"
    });
  }
};

// Admin authorization middleware
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      console.log('❌ Admin check failed: User not authenticated');
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "User not authenticated"
      });
    }

    console.log('🔍 Checking admin role for user:', { userId: user.id, role: user.role });
    
    if (user.role !== 'ADMIN') {
      console.log('❌ Admin check failed: Insufficient permissions');
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        error: "Insufficient permissions"
      });
    }

    console.log('✅ Admin access granted');
    next();
    return;
  } catch (error) {
    console.error("❌ Error in admin authorization middleware:", error);
    return res.status(500).json({
      success: false,
      message: "Authorization error",
      error: "Internal server error"
    });
  }
};

// Optional authentication middleware (doesn't fail if no auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let nextAuthSecret = req.headers['x-nextauth-secret'] as string || req.body?.nextAuthSecret;
    if (!nextAuthSecret) {
      const authHeader = req.headers['authorization'] as string | undefined;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        nextAuthSecret = authHeader.slice('Bearer '.length);
      }
    }
    
    if (nextAuthSecret) {
      const sessionValidation = await authService.validateSession(nextAuthSecret);
      if (sessionValidation.isValid) {
        (req as any).user = sessionValidation.user;
      }
    }

    next();
    return;
  } catch (error) {
    console.error("Error in optional authentication middleware:", error);
    // Don't fail the request, just continue without user
    next();
    return;
  }
};

// Check if user is banned or trashed
export const checkUserStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      console.log('❌ User status check failed: User not authenticated');
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "User not authenticated"
      });
    }

    console.log('🔍 Checking user status:', { 
      userId: user.id, 
      isBanned: user.isBanned, 
      isTrashed: user.isTrashed, 
      isDeletedPermanently: user.isDeletedPermanently 
    });

    if (user.isBanned) {
      console.log('❌ User status check failed: Account is banned');
      return res.status(403).json({
        success: false,
        message: "Account is banned",
        error: "Account access denied"
      });
    }

    if (user.isTrashed) {
      console.log('❌ User status check failed: Account is deleted');
      return res.status(403).json({
        success: false,
        message: "Account is deleted",
        error: "Account access denied"
      });
    }

    if (user.isDeletedPermanently) {
      console.log('❌ User status check failed: Account is permanently deleted');
      return res.status(403).json({
        success: false,
        message: "Account is permanently deleted",
        error: "Account access denied"
      });
    }

    console.log('✅ User status check passed');
    next();
    return;
  } catch (error) {
    console.error("❌ Error in user status middleware:", error);
    return res.status(500).json({
      success: false,
      message: "User status check error",
      error: "Internal server error"
    });
  }
};

// Combined authentication and status check
export const authenticateAndCheckStatus = [
  authenticateUser,
  checkUserStatus
];

// Combined admin authentication and status check
export const authenticateAdminAndCheckStatus = [
  authenticateUser,
  checkUserStatus,
  requireAdmin
];


