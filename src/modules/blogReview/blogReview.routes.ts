import { Router } from 'express';
import {
  getBlogReviewsByBlogId,
  getBlogReviewById,
  createBlogReview,
  updateBlogReview,
  deleteBlogReview,
  replyToBlogReview,
  updateBlogReviewReply
} from './blogReview.controller';
import { authMiddleware } from '../../middlewares/auth';
import { checkReviewOwnership, checkReplyOwnership } from './blogReview.middleware';

const router = Router();

router.get('/blog-review/:blogId', getBlogReviewsByBlogId);
router.get('/blog-review/review/:reviewId', getBlogReviewById);
router.post('/blog-review', authMiddleware, createBlogReview);
router.put('/blog-review/:reviewId', authMiddleware, checkReviewOwnership, updateBlogReview);
router.delete('/blog-review/:reviewId', authMiddleware, checkReviewOwnership, deleteBlogReview);
router.post('/blog-review/:reviewId/reply', authMiddleware, replyToBlogReview);
router.put('/blog-review/:reviewId/reply', authMiddleware, checkReplyOwnership, updateBlogReviewReply);

export default router;
