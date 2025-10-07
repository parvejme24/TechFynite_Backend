import { Request, Response, NextFunction } from "express";
import {
  registerUserSchema,
  loginUserSchema,
  googleLoginSchema,
  changePasswordSchema,
  updateProfileSchema,
  userQuerySchema,
  userIdSchema,
  sessionValidationSchema,
  logoutSchema,
  verifyOtpSchema,
  resendOtpSchema
} from "./auth.type";

// Validate user registration
export const validateRegisterUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerUserSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate user login
export const validateLoginUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginUserSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate Google OAuth login
export const validateGoogleLogin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = googleLoginSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// (Removed generic validateUpdateUser as generic admin update endpoint was removed)

// Validate change password
export const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = changePasswordSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate update profile
export const validateUpdateProfile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate user query parameters
export const validateUserQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userQuerySchema.parse(req.query);
    (req as any).validatedQuery = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid query parameters",
      error: error.errors || error.message,
    });
  }
};

// Validate user ID parameter
export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = userIdSchema.parse(req.params);
    req.params = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Invalid user ID",
      error: error.errors || error.message,
    });
  }
};

// Validate session validation
export const validateSessionValidation = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = sessionValidationSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate logout
export const validateLogout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = logoutSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate verify OTP
export const validateVerifyOtp = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = verifyOtpSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};

// Validate resend OTP
export const validateResendOtp = (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = resendOtpSchema.parse(req.body);
    req.body = validatedData;
    next();
    return;
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      error: error.errors || error.message,
    });
  }
};
