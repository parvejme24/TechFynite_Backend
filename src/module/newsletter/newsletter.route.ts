import { Router } from "express";
import {
  subscribeNewsletter,
  getAllNewsletterSubscribers,
  deleteNewsletterSubscriber,
  newsletterStats,
} from "./newsletter.controller";

const router = Router();

// Subscribe to newsletter
router.post("/newsletter", subscribeNewsletter);

// Get all newsletter subscribers
router.get("/newsletter", getAllNewsletterSubscribers);

// Get newsletter statistics (daily, weekly, monthly, yearly)
router.get("/newsletter/stats", newsletterStats);

// Delete newsletter subscriber by ID
router.delete("/newsletter/:id", deleteNewsletterSubscriber);

export default router;
