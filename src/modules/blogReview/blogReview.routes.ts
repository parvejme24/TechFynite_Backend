import { Router } from "express";
import {
  getAllBlogReviews,
  getBlogReviewById,
  createBlogReview,
  updateBlogReview,
  deleteBlogReview,
} from "./blogReview.controller";
import { authMiddleware } from "../../middlewares/auth";
import { checkReviewOwnership } from './blogReview.middleware';

const router = Router();

router.get("/blog-reviews", getAllBlogReviews);
router.get("/blog-reviews/:id", getBlogReviewById);
router.get("/blog-reviews/blog/:blogId", getAllBlogReviews);
router.post("/blog-reviews", authMiddleware, createBlogReview);
router.put("/blog-reviews/:id", authMiddleware, checkReviewOwnership, updateBlogReview);
router.delete("/blog-reviews/:id", authMiddleware, checkReviewOwnership, deleteBlogReview);

export default router;
