"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const cloudinary_upload_1 = require("../../middlewares/cloudinary-upload");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes
router.get('/blogs', blog_controller_1.getAllBlogs);
router.get('/blogs/search', blog_controller_1.searchBlogs);
router.get('/blogs/popular', blog_controller_1.getPopularBlogs);
router.get('/blogs/slug/:slug', blog_controller_1.getBlogBySlug);
router.get('/blogs/:id', blog_controller_1.getBlogById);
router.get('/blogs/category/:categoryId', blog_controller_1.getBlogsByCategory);
router.get('/blogs/author/:authorId', blog_controller_1.getBlogsByAuthor);
// Protected routes (require authentication)
router.post('/blogs', auth_1.authMiddleware, cloudinary_upload_1.uploadBlogFilesCloudinary, blog_controller_1.createBlog);
router.put('/blogs/:id', auth_1.authMiddleware, cloudinary_upload_1.uploadBlogFilesCloudinary, blog_controller_1.updateBlog);
router.delete('/blogs/:id', auth_1.authMiddleware, blog_controller_1.deleteBlog);
router.post('/blogs/:id/like', auth_1.authMiddleware, blog_controller_1.likeBlog);
router.post('/blogs/:id/unlike', auth_1.authMiddleware, blog_controller_1.unlikeBlog);
router.patch('/blogs/:id/publish', auth_1.authMiddleware, blog_controller_1.togglePublishStatus);
exports.default = router;
