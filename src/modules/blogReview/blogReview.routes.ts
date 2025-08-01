import { Router } from 'express';
import { BlogReviewController } from './blogReview.controller';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();
const blogReviewController = new BlogReviewController();

// Public routes (No authentication required)
router.get('/blog-review/:blogId', blogReviewController.getReviewsByBlogId.bind(blogReviewController));
router.get('/blog-review/review/:id', blogReviewController.getReviewById.bind(blogReviewController));
router.post('/blog-review', blogReviewController.createBlogReview.bind(blogReviewController));

// Protected routes (Authenticated users only)
router.put('/blog-review/:id', authMiddleware, blogReviewController.updateBlogReview.bind(blogReviewController));
router.delete('/blog-review/:id', authMiddleware, blogReviewController.deleteBlogReview.bind(blogReviewController));

// Admin routes (Admin authentication required)
router.post('/blog-review/:id/reply', authMiddleware, blogReviewController.replyToBlogReview.bind(blogReviewController));

export default router;
