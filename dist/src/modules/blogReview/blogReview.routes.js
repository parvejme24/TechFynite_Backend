"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const blogReview_controller_1 = require("./blogReview.controller");
const auth_1 = require("../../middlewares/auth");
const router = (0, express_1.Router)();
// Public routes (no authentication required)
router.get('/blog-reviews/:blogId', blogReview_controller_1.getBlogReviews);
router.post('/blog-reviews', blogReview_controller_1.createBlogReview); // Anyone can create reviews
// Protected routes (require authentication)
router.put('/blog-reviews/:id', auth_1.authMiddleware, blogReview_controller_1.updateBlogReview);
router.delete('/blog-reviews/:id', auth_1.authMiddleware, blogReview_controller_1.deleteBlogReview);
// Admin/Moderator routes (require admin/super admin)
router.post('/blog-reviews/:id/reply', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, blogReview_controller_1.replyToReview);
router.put('/blog-reviews/replies/:replyId', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, blogReview_controller_1.updateReply);
router.delete('/blog-reviews/replies/:replyId', auth_1.authMiddleware, auth_1.adminOrSuperAdminOnly, blogReview_controller_1.deleteReply);
exports.default = router;
