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
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', authMiddleware, createBlog);
router.put('/blogs/:id', authMiddleware, updateBlog);
router.delete('/blogs/:id', authMiddleware, deleteBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);
router.post('/blogs/:id/unlike', authMiddleware, unlikeBlog);

export default router; 