import { Router } from "express";
import authRoutes from "../module/auth/auth.route";
import newsletterRoutes from "../module/newsletter/newsletter.route";
import contactRoutes from "../module/contact/contact.route";
import blogCategoryRoutes from "../module/blog-category/blog-category.route";
import blogRoutes from "../module/blog/blog.route";
import blogReviewRoutes from "../module/blog-review/blog-review.route";
import templateCategoryRoutes from "../module/template-category/template-category.route";
import templateRoutes from "../module/template/template.route";
import orderRoutes from "../module/order/order.route";
import licenseRoutes from "../module/license/license.route";
import webhookRoutes from "../module/webhook/webhook.route";

const router = Router();

// Auth routes
router.use("/api/v1", authRoutes);

// Newsletter routes
router.use("/api/v1", newsletterRoutes);

// Contact routes
router.use("/api/v1", contactRoutes);

// Blog category routes
router.use("/api/v1", blogCategoryRoutes);

// Blog routes
router.use("/api/v1", blogRoutes);

// Blog review routes
router.use("/api/v1", blogReviewRoutes);

// Template category routes
router.use("/api/v1", templateCategoryRoutes);

// Template routes
router.use("/api/v1", templateRoutes);

// Order routes
router.use("/api/v1", orderRoutes);

// License routes
router.use("/api/v1", licenseRoutes);

// Webhook routes
router.use("/api/v1", webhookRoutes);

export default router;
