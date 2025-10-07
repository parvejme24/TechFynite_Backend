
import { Router } from "express";
import {
  addNewContact,
  getAllContacts,
  sendContactReply,
  getContactsByUserEmail,
  getContactById,
  deleteContact,
  getContactStats,
} from "./contact.controller";
import { authenticateAdminAndCheckStatus, authenticateUser } from "../../middleware/authMiddleware";

const router = Router();

// Public route - anyone can submit contact form (with or without user account)
router.post("/contacts", addNewContact);

// Admin/Super Admin only routes
router.get("/contacts", authenticateAdminAndCheckStatus, getAllContacts);
router.post("/contacts/:id/reply", authenticateAdminAndCheckStatus, sendContactReply);

// Stats route must come before :id route
router.get("/contacts/stats", authenticateAdminAndCheckStatus, getContactStats);

// User routes - requires user account
router.get("/contacts/email/:userEmail", authenticateUser, getContactsByUserEmail);
router.get("/contacts/:id", authenticateUser, getContactById);
router.delete("/contacts/:id", authenticateUser, deleteContact);

export default router;
