import { Router } from "express";
import {
  createBlogReview,
  createBlogReviewReply,
  getReviewsByBlogId,
  getBlogReviewById,
  deleteBlogReview,
  deleteBlogReviewReply,
} from "./blog-review.controller";
import {
  validateCreateBlogReview,
  validateCreateBlogReviewReply,
  validateBlogReviewId,
  validateBlogIdParam,
} from "./blog-review.validate";
import { authenticateAdminAndCheckStatus } from "../../middleware/authMiddleware";

const router = Router();

// Public routes
router.get("/blog-reviews/:blogId", validateBlogIdParam, getReviewsByBlogId);
router.get("/blog-reviews/review/:reviewId", validateBlogReviewId, getBlogReviewById);

// User routes (authentication required)
router.post("/blog-reviews/:blogId", validateBlogIdParam, validateCreateBlogReview, createBlogReview);
router.post("/blog-reviews/reply/:reviewId", authenticateAdminAndCheckStatus, validateBlogReviewId, validateCreateBlogReviewReply, createBlogReviewReply);
router.delete("/blog-reviews/:reviewId", validateBlogReviewId, deleteBlogReview);
router.delete("/blog-reviews/reply/:replyId", deleteBlogReviewReply);

// Admin approval routes removed to match Prisma model

export default router;

