import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  getBlogsByAuthor,
  getBlogStats,
  toggleBlogLike,
  getPublishedBlogs,
  getDraftBlogs,
  togglePublish,
} from "./blog.controller";
import {
  validateBlogQuery,
  validateBlogId,
  validateCreateBlog,
  validateUpdateBlog,
  validateCategoryId,
  validateAuthorId,
  validateBlogLike,
} from "./blog.validate";
import { uploadBlogImageCloudinary, handleUploadError } from "../../middleware/cloudinary-upload";

const router = Router();


// Get blogs
router.get("/blogs", validateBlogQuery, getAllBlogs);
router.get("/blogs/published", validateBlogQuery, getPublishedBlogs);
router.get("/blogs/drafts", validateBlogQuery, getDraftBlogs);
router.get("/blogs/stats", getBlogStats);
router.get("/blogs/category/:categoryId", validateCategoryId, validateBlogQuery, getBlogsByCategory);
router.get("/blogs/author/:authorId", validateAuthorId, validateBlogQuery, getBlogsByAuthor);
router.get("/blogs/:id", validateBlogId, getBlogById);

// Create/Update blogs
router.post("/blogs", (req, res, next) => {
  (uploadBlogImageCloudinary as any)(req, res, (err: any) => {
    if (err) return handleUploadError(err, req, res, next);
    return next();
  });
}, validateCreateBlog, addBlog);
router.put("/blogs/:id", validateBlogId, (req, res, next) => {
  (uploadBlogImageCloudinary as any)(req, res, (err: any) => {
    if (err) return handleUploadError(err, req, res, next);
    return next();
  });
}, validateUpdateBlog, updateBlog);
router.delete("/blogs/:id", validateBlogId, deleteBlog);

// Blog likes
router.post("/blogs/:id/toggle-like", validateBlogId, validateBlogLike, toggleBlogLike);

// Blog status management
router.patch("/blogs/:id/toggle-publish", validateBlogId, togglePublish);

export default router;