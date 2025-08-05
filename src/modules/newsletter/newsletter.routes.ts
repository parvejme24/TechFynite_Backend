import { Router } from "express";
import {
  subscribeNewsletter,
  getAllNewsletterSubscribers,
  getNewsletterSubscriberCount,
  getSubscribersWithAxios,
  getAllNewsletterSubscribersFromDatabase,
  getNewsletterSubscriberCountFromDatabase,
  unsubscribeNewsletter,
} from "./newsletter.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Public routes - anyone can subscribe/unsubscribe
router.post("/newsletter", subscribeNewsletter);
router.post("/newsletter/unsubscribe", unsubscribeNewsletter);

// Admin routes - protected with authentication (Mailchimp-based)
router.get(
  "/newsletter/subscribers",
  authMiddleware,
  getAllNewsletterSubscribers
);
router.get("/newsletter/count", authMiddleware, getNewsletterSubscriberCount);

// New route for Axios-based subscriber fetching (Admin only)
router.get("/subscribers", authMiddleware, getSubscribersWithAxios);

// Database-based admin routes - protected with authentication
router.get(
  "/newsletter/subscribers/database",
  authMiddleware,
  getAllNewsletterSubscribersFromDatabase
);
router.get(
  "/newsletter/count/database", 
  authMiddleware, 
  getNewsletterSubscriberCountFromDatabase
);

export default router;
