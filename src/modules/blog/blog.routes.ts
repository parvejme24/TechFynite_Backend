import { Router } from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
} from './blog.controller';
import { authMiddleware, adminOnly } from '../../middlewares/auth';

const router = Router();

router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', authMiddleware, adminOnly, createBlog);
router.put('/blogs/:id', authMiddleware, adminOnly, updateBlog);
router.delete('/blogs/:id', authMiddleware, adminOnly, deleteBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);
router.post('/blogs/:id/unlike', authMiddleware, unlikeBlog);

export default router; 