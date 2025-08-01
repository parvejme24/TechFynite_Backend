"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("./contact.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Public route - anyone can submit contact form (with or without user account)
router.post("/contacts", contact_controller_1.addNewContact);
// Admin/Super Admin only routes
router.get("/contacts", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.getAllContacts);
router.patch("/contacts/:id/status", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.changeContactStatus);
router.post("/contacts/:id/reply", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.sendContactReply);
router.post("/contacts/:id/resend", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.resendContactNotification);
// Contact Reply routes (Admin/Super Admin only)
router.post("/contacts/:id/replies", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.addContactReply);
router.get("/contacts/:id/replies", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.getContactReplies);
router.delete("/contacts/replies/:replyId", auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, contact_controller_1.deleteContactReply);
// User routes - requires user account
router.get("/contacts/user", auth_1.authMiddleware, contact_controller_1.getUserContacts);
router.get("/contacts/:id", auth_1.authMiddleware, contact_controller_1.getContactById);
router.delete("/contacts/:id", auth_1.authMiddleware, contact_controller_1.deleteContact);
exports.default = router;
