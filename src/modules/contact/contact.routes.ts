import { Router } from "express";
import {
  addNewContact,
  getAllContacts,
  getUserContacts,
  getContactById,
  deleteContact,
  changeContactStatus,
  sendContactReply,
  resendContactNotification,
  addContactReply,
  getContactReplies,
  deleteContactReply,
} from "./contact.controller";
import { authMiddleware, adminOrSuperAdminOnly } from "../../middlewares/auth";

const router = Router();

// Public route - anyone can submit contact form (with or without user account)
router.post("/contacts", addNewContact);

// Admin/Super Admin only routes
router.get("/contacts", authMiddleware, adminOrSuperAdminOnly, getAllContacts);
router.patch("/contacts/:id/status", authMiddleware, adminOrSuperAdminOnly, changeContactStatus);
router.post("/contacts/:id/reply", authMiddleware, adminOrSuperAdminOnly, sendContactReply);
router.post("/contacts/:id/resend", authMiddleware, adminOrSuperAdminOnly, resendContactNotification);

// Contact Reply routes (Admin/Super Admin only)
router.post("/contacts/:id/replies", authMiddleware, adminOrSuperAdminOnly, addContactReply);
router.get("/contacts/:id/replies", authMiddleware, adminOrSuperAdminOnly, getContactReplies);
router.delete("/contacts/replies/:replyId", authMiddleware, adminOrSuperAdminOnly, deleteContactReply);

// User routes - requires user account
router.get("/contacts/user", authMiddleware, getUserContacts);
router.get("/contacts/:id", authMiddleware, getContactById);
router.delete("/contacts/:id", authMiddleware, deleteContact);

export default router;
