
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
import {
  validateCreateContact,
  validateContactQuery,
  validateCreateContactReply,
  validateContactParams,
  validateUserEmailParams,
} from "./contact.validate";

const router = Router();

// Public route - anyone can submit contact form (with or without user account)
router.post("/contacts", validateCreateContact, addNewContact);

// Admin/Super Admin only routes
router.get("/contacts", validateContactQuery, getAllContacts);
router.post("/contacts/:id/reply", validateContactParams, validateCreateContactReply, sendContactReply);

// Stats route must come before :id route
router.get("/contacts/stats", getContactStats);

// User routes - requires user account
router.get("/contacts/email/:userEmail", validateUserEmailParams, getContactsByUserEmail);
router.get("/contacts/:id", validateContactParams, getContactById);
router.delete("/contacts/:id", validateContactParams, deleteContact);

export default router;
