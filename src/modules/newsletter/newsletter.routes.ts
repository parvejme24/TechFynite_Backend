import { Router } from "express";
import {
  subscribeNewsletter,
  getAllNewsletterSubscribers,
  getNewsletterSubscriberCount,
  getSubscribersWithAxios,
} from "./newsletter.controller";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Public route - anyone can subscribe
router.post("/newsletter", subscribeNewsletter);

// Admin routes - protected with authentication
router.get(
  "/newsletter/subscribers",
  authMiddleware,
  getAllNewsletterSubscribers
);
router.get("/newsletter/count", authMiddleware, getNewsletterSubscriberCount);

// New route for Axios-based subscriber fetching (Admin only)
router.get("/subscribers", authMiddleware, getSubscribersWithAxios);

export default router;
