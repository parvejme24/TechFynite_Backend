import { Router } from 'express';
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from './blogCategory.controller';

const router = Router();

router.get('/blog-categories', getAllBlogCategories);
router.get('/blog-categories/:id', getBlogCategoryById);
router.post('/blog-categories', createBlogCategory);
router.put('/blog-categories/:id', updateBlogCategory);
router.delete('/blog-categories/:id', deleteBlogCategory);

export default router; 