"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletter_controller_1 = require("./newsletter.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Public route - anyone can subscribe
router.post("/newsletter", newsletter_controller_1.subscribeNewsletter);
// Admin routes - protected with authentication
router.get("/newsletter/subscribers", auth_1.authMiddleware, newsletter_controller_1.getAllNewsletterSubscribers);
router.get("/newsletter/count", auth_1.authMiddleware, newsletter_controller_1.getNewsletterSubscriberCount);
// New route for Axios-based subscriber fetching (Admin only)
router.get("/subscribers", auth_1.authMiddleware, newsletter_controller_1.getSubscribersWithAxios);
exports.default = router;
