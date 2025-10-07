import { Router } from "express";
import {
  registerUser,
  loginUser,
  googleLogin,
  verifyOtp,
  resendOtp,
  validateSession,
  logoutUser,
  changePassword,
  updateProfile,
  updateAvatarImage,
  getCurrentUser,
  getUserById,
  getAllUsers,
  getUserStats,
  deleteUser,
  banUser,
  unbanUser,
  trashUser,
  restoreUser,
  changeUserRole,
} from "./auth.controller";
import {
  validateRegisterUser,
  validateLoginUser,
  validateGoogleLogin,
  validateVerifyOtp,
  validateResendOtp,
  validateChangePassword,
  validateUpdateProfile,
  validateUserQuery,
  validateUserId,
  validateSessionValidation,
  validateLogout,
} from "./auth.validate";
import {
  authenticateAndCheckStatus,
  authenticateAdminAndCheckStatus,
} from "../../middleware/authMiddleware";
import { uploadImageMemory, handleUploadError } from "../../middleware/cloudinary-upload";
import { Request, Response, NextFunction } from "express";

const router = Router();

// Public routes (no authentication required)
router.post("/auth/register", validateRegisterUser, registerUser);
router.post("/auth/verify-otp", validateVerifyOtp, verifyOtp);
router.post("/auth/resend-otp", validateResendOtp, resendOtp);
router.post("/auth/login", validateLoginUser, loginUser);
router.post("/auth/google-login", validateGoogleLogin, googleLogin);
router.post("/auth/validate-session", validateSessionValidation, validateSession);
router.post("/auth/logout", validateLogout, logoutUser);

// Protected routes (authentication required)
router.post("/auth/change-password", authenticateAndCheckStatus, validateChangePassword, changePassword);
router.put("/auth/profile", authenticateAndCheckStatus, validateUpdateProfile, updateProfile);
// Use memory upload; controller streams to Cloudinary
router.put("/auth/profile/avatar", authenticateAndCheckStatus, (req: Request, res: Response, next: NextFunction) => {
  (uploadImageMemory as any)(req, res, (err: any) => {
    if (err) return handleUploadError(err, req, res, next);
    return next();
  });
}, updateAvatarImage);
router.get("/auth/me", authenticateAndCheckStatus, getCurrentUser);

// Admin routes (admin authentication required)
router.get("/auth/users", authenticateAdminAndCheckStatus, validateUserQuery, getAllUsers);
router.get("/auth/users/stats", authenticateAdminAndCheckStatus, getUserStats);
router.get("/auth/users/:id", authenticateAdminAndCheckStatus, validateUserId, getUserById);
router.delete("/auth/users/:id", authenticateAdminAndCheckStatus, validateUserId, deleteUser);

// Specific admin user management routes
router.patch("/auth/users/:id/ban", authenticateAdminAndCheckStatus, validateUserId, banUser);
router.patch("/auth/users/:id/unban", authenticateAdminAndCheckStatus, validateUserId, unbanUser);
router.patch("/auth/users/:id/trash", authenticateAdminAndCheckStatus, validateUserId, trashUser);
router.patch("/auth/users/:id/restore", authenticateAdminAndCheckStatus, validateUserId, restoreUser);
router.patch("/auth/users/:id/role", authenticateAdminAndCheckStatus, validateUserId, changeUserRole);

export default router;