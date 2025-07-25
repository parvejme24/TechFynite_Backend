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
import { upload } from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'contentImages', maxCount: 20 }
]), createBlog);
router.put('/blogs/:id', authMiddleware, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'contentImages', maxCount: 20 }
]), updateBlog);
router.delete('/blogs/:id', authMiddleware, deleteBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);
router.post('/blogs/:id/unlike', authMiddleware, unlikeBlog);

export default router;
