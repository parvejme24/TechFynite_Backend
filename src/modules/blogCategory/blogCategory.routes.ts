import { Router } from 'express';
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from './blogCategory.controller';
import { authMiddleware, adminOrSuperAdminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/blog-categories', getAllBlogCategories);
router.get('/blog-categories/:id', getBlogCategoryById);
router.post('/blog-categories', authMiddleware, adminOrSuperAdminOnly, createBlogCategory);
router.put('/blog-categories/:id', authMiddleware, adminOrSuperAdminOnly, updateBlogCategory);
router.delete('/blog-categories/:id', authMiddleware, adminOrSuperAdminOnly, deleteBlogCategory);

export default router; 