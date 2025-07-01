import { Router } from 'express';
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from './blogCategory.controller';
import { authMiddleware, adminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/blog-categories', getAllBlogCategories);
router.get('/blog-categories/:id', getBlogCategoryById);
router.post('/blog-categories', authMiddleware, adminOnly, createBlogCategory);
router.put('/blog-categories/:id', authMiddleware, adminOnly, updateBlogCategory);
router.delete('/blog-categories/:id', authMiddleware, adminOnly, deleteBlogCategory);

export default router; 