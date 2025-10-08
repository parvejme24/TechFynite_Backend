"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const blog_validate_1 = require("./blog.validate");
const cloudinary_upload_1 = require("../../middleware/cloudinary-upload");
const router = (0, express_1.Router)();
router.get("/blogs", blog_validate_1.validateBlogQuery, blog_controller_1.getAllBlogs);
router.get("/blogs/published", blog_validate_1.validateBlogQuery, blog_controller_1.getPublishedBlogs);
router.get("/blogs/drafts", blog_validate_1.validateBlogQuery, blog_controller_1.getDraftBlogs);
router.get("/blogs/stats", blog_controller_1.getBlogStats);
router.get("/blogs/category/:categoryId", blog_validate_1.validateCategoryId, blog_validate_1.validateBlogQuery, blog_controller_1.getBlogsByCategory);
router.get("/blogs/author/:authorId", blog_validate_1.validateAuthorId, blog_validate_1.validateBlogQuery, blog_controller_1.getBlogsByAuthor);
router.get("/blogs/:id", blog_validate_1.validateBlogId, blog_controller_1.getBlogById);
router.post("/blogs", (req, res, next) => {
    cloudinary_upload_1.uploadBlogImageCloudinary(req, res, (err) => {
        if (err)
            return (0, cloudinary_upload_1.handleUploadError)(err, req, res, next);
        return next();
    });
}, blog_validate_1.validateCreateBlog, blog_controller_1.addBlog);
router.put("/blogs/:id", blog_validate_1.validateBlogId, (req, res, next) => {
    cloudinary_upload_1.uploadBlogImageCloudinary(req, res, (err) => {
        if (err)
            return (0, cloudinary_upload_1.handleUploadError)(err, req, res, next);
        return next();
    });
}, blog_validate_1.validateUpdateBlog, blog_controller_1.updateBlog);
router.delete("/blogs/:id", blog_validate_1.validateBlogId, blog_controller_1.deleteBlog);
router.post("/blogs/:id/toggle-like", blog_validate_1.validateBlogId, blog_validate_1.validateBlogLike, blog_controller_1.toggleBlogLike);
router.patch("/blogs/:id/toggle-publish", blog_validate_1.validateBlogId, blog_controller_1.togglePublish);
exports.default = router;
//# sourceMappingURL=blog.route.js.map