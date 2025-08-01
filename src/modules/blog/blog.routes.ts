import { Router } from 'express';
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  getPopularBlogs,
  searchBlogs,
  togglePublishStatus,
} from './blog.controller';
import { 
  uploadBlogFiles
} from '../../middlewares/upload';
import { authMiddleware } from '../../middlewares/auth';

const router = Router();

// Public routes
router.get('/blogs', getAllBlogs);
router.get('/blogs/search', searchBlogs);
router.get('/blogs/popular', getPopularBlogs);
router.get('/blogs/slug/:slug', getBlogBySlug);
router.get('/blogs/:id', getBlogById);
router.get('/blogs/category/:categoryId', getBlogsByCategory);
router.get('/blogs/author/:authorId', getBlogsByAuthor);

// Protected routes (require authentication)
router.post('/blogs', authMiddleware, 
  uploadBlogFiles,
  createBlog
);
router.put('/blogs/:id', authMiddleware, 
  uploadBlogFiles,
  updateBlog
);
router.delete('/blogs/:id', authMiddleware, deleteBlog);
router.post('/blogs/:id/like', authMiddleware, likeBlog);
router.post('/blogs/:id/unlike', authMiddleware, unlikeBlog);
router.patch('/blogs/:id/publish', authMiddleware, togglePublishStatus);

export default router;
