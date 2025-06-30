import { Router } from 'express';
import {
  getAllBlogReviews,
  getBlogReviewById,
  createBlogReview,
  updateBlogReview,
  deleteBlogReview,
} from './blogReview.controller';

const router = Router();

router.get('/blog-reviews', getAllBlogReviews);
router.get('/blog-reviews/:id', getBlogReviewById);
router.post('/blog-reviews', createBlogReview);
router.put('/blog-reviews/:id', updateBlogReview);
router.delete('/blog-reviews/:id', deleteBlogReview);

export default router; 