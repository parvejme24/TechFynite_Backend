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
import { cloudinaryHealthCheck, debugCloudinaryConfig } from "../middleware/cloudinary-upload";

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

// Health: Cloudinary connectivity
router.get("/api/v1/health/cloudinary", async (req, res) => {
  const result = await cloudinaryHealthCheck();
  if (result.ok) return res.json({ success: true, message: "Cloudinary OK", info: result.message });
  return res.status(500).json({ success: false, message: "Cloudinary error", error: result.message });
});

// Debug: Cloudinary configuration
router.get("/api/v1/debug/cloudinary", (req, res) => {
  debugCloudinaryConfig();
  res.json({ success: true, message: "Debug info logged to console" });
});

// Test: Simple Cloudinary upload without multer
router.post("/api/v1/test/cloudinary", async (req, res) => {
  try {
    const { uploadBufferToCloudinary } = await import("../middleware/cloudinary-upload");
    
    // Create a simple test buffer
    const testBuffer = Buffer.from("test image data");
    const testFile = {
      buffer: testBuffer,
      originalname: "test.jpg",
      mimetype: "image/jpeg"
    } as Express.Multer.File;
    
    const result = await uploadBufferToCloudinary(testFile, "test");
    res.json({ success: true, message: "Cloudinary test successful", data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: "Cloudinary test failed", error: error.message });
  }
});

export default router;
