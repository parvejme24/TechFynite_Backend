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
import { 
  uploadBlogThumbnail, 
  uploadBlogContentImage 
} from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', authMiddleware, 
  uploadBlogThumbnail.single('image'),
  uploadBlogContentImage.array('contentImages', 20),
  createBlog
);
router.put('/blogs/:id', authMiddleware, 
  uploadBlogThumbnail.single('image'),
  uploadBlogContentImage.array('contentImages', 20),
  updateBlog
);
router.delete('/blogs/:id', authMiddleware, deleteBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);
router.post('/blogs/:id/unlike', authMiddleware, unlikeBlog);

export default router;
