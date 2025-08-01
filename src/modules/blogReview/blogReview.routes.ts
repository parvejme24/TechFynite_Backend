import { Router } from 'express';
import {
  createBlogReview,
  getBlogReviews,
  updateBlogReview,
  deleteBlogReview,
  replyToReview,
  updateReply,
  deleteReply,
} from './blogReview.controller';
import { authMiddleware, adminOrSuperAdminOnly } from '../../middlewares/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/blog-reviews/:blogId', getBlogReviews);
router.post('/blog-reviews', createBlogReview); // Anyone can create reviews

// Protected routes (require authentication)
router.put('/blog-reviews/:id', authMiddleware, updateBlogReview);
router.delete('/blog-reviews/:id', authMiddleware, deleteBlogReview);

// Admin/Moderator routes (require admin/super admin)
router.post('/blog-reviews/:id/reply', authMiddleware, adminOrSuperAdminOnly, replyToReview);
router.put('/blog-reviews/replies/:replyId', authMiddleware, adminOrSuperAdminOnly, updateReply);
router.delete('/blog-reviews/replies/:replyId', authMiddleware, adminOrSuperAdminOnly, deleteReply);

export default router;
