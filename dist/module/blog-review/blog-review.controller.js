"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBlogReviewStats = exports.deleteBlogReviewReply = exports.deleteBlogReview = exports.getBlogReviewById = exports.getReviewsByBlogId = exports.getBlogReviews = exports.createBlogReviewReply = exports.createBlogReview = void 0;
const blog_review_service_1 = require("./blog-review.service");
const createBlogReview = async (req, res) => {
    try {
        const { blogId } = req.params;
        const reviewData = { ...req.body, blogId };
        const hasReviewed = await blog_review_service_1.blogReviewService.hasUserReviewed(blogId, reviewData.userId);
        if (hasReviewed) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this blog",
                error: "Duplicate review not allowed"
            });
        }
        const review = await blog_review_service_1.blogReviewService.createBlogReview(reviewData);
        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: review,
        });
    }
    catch (error) {
        console.error("Error creating blog review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create blog review",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createBlogReview = createBlogReview;
const createBlogReviewReply = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const adminId = req.user?.id;
        if (!adminId) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
                error: "Admin user not found in context",
            });
        }
        const replyData = { ...req.body, reviewId, adminId };
        const reply = await blog_review_service_1.blogReviewService.createBlogReviewReply(replyData);
        return res.status(201).json({
            success: true,
            message: "Reply submitted successfully.",
            data: reply,
        });
    }
    catch (error) {
        console.error("Error creating blog review reply:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create blog review reply",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.createBlogReviewReply = createBlogReviewReply;
const getBlogReviews = async (req, res) => {
    try {
        const query = req.validatedQuery || req.query;
        const result = await blog_review_service_1.blogReviewService.getBlogReviews(query);
        return res.status(200).json({
            success: true,
            message: "Blog reviews fetched successfully",
            data: result.reviews,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching blog reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog reviews",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogReviews = getBlogReviews;
const getReviewsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        const query = req.validatedQuery || req.query;
        const result = await blog_review_service_1.blogReviewService.getReviewsByBlogId(blogId, query);
        return res.status(200).json({
            success: true,
            message: "Blog reviews fetched successfully",
            data: result.reviews,
            pagination: result.pagination,
        });
    }
    catch (error) {
        console.error("Error fetching blog reviews:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog reviews",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getReviewsByBlogId = getReviewsByBlogId;
const getBlogReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await blog_review_service_1.blogReviewService.getBlogReviewById(reviewId);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Review fetched successfully",
            data: review,
        });
    }
    catch (error) {
        console.error("Error fetching blog review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog review",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogReviewById = getBlogReviewById;
const deleteBlogReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const deleted = await blog_review_service_1.blogReviewService.deleteBlogReview(reviewId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Review deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error deleting blog review:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog review",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteBlogReview = deleteBlogReview;
const deleteBlogReviewReply = async (req, res) => {
    try {
        const { replyId } = req.params;
        const deleted = await blog_review_service_1.blogReviewService.deleteBlogReviewReply(replyId);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: "Reply not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Reply deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error deleting blog review reply:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete blog review reply",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.deleteBlogReviewReply = deleteBlogReviewReply;
const getBlogReviewStats = async (req, res) => {
    try {
        const { blogId } = req.query;
        const stats = await blog_review_service_1.blogReviewService.getBlogReviewStats(blogId);
        return res.status(200).json({
            success: true,
            message: "Blog review statistics fetched successfully",
            data: stats,
        });
    }
    catch (error) {
        console.error("Error fetching blog review statistics:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch blog review statistics",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
};
exports.getBlogReviewStats = getBlogReviewStats;
//# sourceMappingURL=blog-review.controller.js.map