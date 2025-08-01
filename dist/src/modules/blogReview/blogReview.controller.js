"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteReply = exports.updateReply = exports.replyToReview = exports.deleteBlogReview = exports.updateBlogReview = exports.getBlogReviews = exports.createBlogReview = void 0;
const blogReview_model_1 = require("./blogReview.model");
const createBlogReview = async (req, res) => {
    try {
        const { blogId, commentText, rating, fullName, email, photoUrl } = req.body;
        // Validate required fields
        if (!blogId) {
            return res.status(400).json({ error: "Blog ID is required" });
        }
        if (!commentText) {
            return res.status(400).json({ error: "Comment text is required" });
        }
        if (!fullName) {
            return res.status(400).json({ error: "Full name is required" });
        }
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }
        // Validate rating if provided
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }
        // Check if user is authenticated
        const user = req.user;
        let userId = null;
        let reviewData;
        if (user) {
            // Authenticated user
            reviewData = {
                blogId,
                userId: user.userId,
                fullName: user.displayName || fullName,
                email: user.email || email,
                photoUrl: user.photoUrl || photoUrl,
                commentText,
                rating: rating || 5,
            };
        }
        else {
            // Anonymous user - no userId needed
            reviewData = {
                blogId,
                fullName,
                email,
                photoUrl,
                commentText,
                rating: rating || 5,
            };
        }
        const review = await blogReview_model_1.BlogReviewModel.create(reviewData);
        res.status(201).json(review);
    }
    catch (error) {
        console.error("Create blog review error:", error);
        res.status(500).json({
            error: "Failed to create blog review",
            details: error instanceof Error ? error.message : error,
        });
    }
};
exports.createBlogReview = createBlogReview;
const getBlogReviews = async (req, res) => {
    try {
        const { blogId } = req.params;
        const reviews = await blogReview_model_1.BlogReviewModel.getByBlogId(blogId);
        res.json(reviews);
    }
    catch (error) {
        console.error("Fetch blog reviews error:", error);
        res.status(500).json({ error: "Failed to fetch blog reviews" });
    }
};
exports.getBlogReviews = getBlogReviews;
const updateBlogReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(401)
                .json({ error: "Unauthorized - User not authenticated" });
        }
        const { commentText, rating } = req.body;
        // Validate rating if provided
        if (rating !== undefined && (rating < 1 || rating > 5)) {
            return res.status(400).json({ error: "Rating must be between 1 and 5" });
        }
        // Check if review exists and user owns it
        const existingReview = await blogReview_model_1.BlogReviewModel.getById(req.params.id);
        if (!existingReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (existingReview.userId !== userId) {
            return res
                .status(403)
                .json({ error: "You can only edit your own reviews" });
        }
        const review = await blogReview_model_1.BlogReviewModel.update(req.params.id, {
            commentText,
            rating,
        });
        res.json(review);
    }
    catch (error) {
        console.error("Update blog review error:", error);
        res.status(500).json({ error: "Failed to update blog review" });
    }
};
exports.updateBlogReview = updateBlogReview;
const deleteBlogReview = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(401)
                .json({ error: "Unauthorized - User not authenticated" });
        }
        // Check if review exists
        const existingReview = await blogReview_model_1.BlogReviewModel.getById(req.params.id);
        if (!existingReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        // Check if user owns the review or is admin
        const user = req.user;
        if (existingReview.userId !== userId &&
            user.role !== "ADMIN" &&
            user.role !== "SUPER_ADMIN") {
            return res
                .status(403)
                .json({ error: "You can only delete your own reviews" });
        }
        await blogReview_model_1.BlogReviewModel.delete(req.params.id);
        res.status(200).json({ message: "Blog review deleted successfully" });
    }
    catch (error) {
        console.error("Delete blog review error:", error);
        res.status(500).json({ error: "Failed to delete blog review" });
    }
};
exports.deleteBlogReview = deleteBlogReview;
// Admin reply to review
const replyToReview = async (req, res) => {
    try {
        const { replyText } = req.body;
        if (!replyText) {
            return res.status(400).json({ error: "Reply text is required" });
        }
        // Check if review exists
        const existingReview = await blogReview_model_1.BlogReviewModel.getById(req.params.id);
        if (!existingReview) {
            return res.status(404).json({ error: "Review not found" });
        }
        // Create a new reply using the new model structure
        const reply = await blogReview_model_1.BlogReviewModel.createReply(req.params.id, req.user.userId, replyText);
        // Get the updated review with all replies
        const review = await blogReview_model_1.BlogReviewModel.getById(req.params.id);
        res.json({
            message: "Reply added successfully",
            reply,
            review,
        });
    }
    catch (error) {
        console.error("Reply to review error:", error);
        res.status(500).json({ error: "Failed to reply to review" });
    }
};
exports.replyToReview = replyToReview;
// Update reply (admin only)
const updateReply = async (req, res) => {
    try {
        const { replyText } = req.body;
        if (!replyText) {
            return res.status(400).json({ error: "Reply text is required" });
        }
        const reply = await blogReview_model_1.BlogReviewModel.updateReply(req.params.replyId, replyText);
        res.json({
            message: "Reply updated successfully",
            reply,
        });
    }
    catch (error) {
        console.error("Update reply error:", error);
        res.status(500).json({ error: "Failed to update reply" });
    }
};
exports.updateReply = updateReply;
// Delete reply (admin only)
const deleteReply = async (req, res) => {
    try {
        await blogReview_model_1.BlogReviewModel.deleteReply(req.params.replyId);
        res.json({
            message: "Reply deleted successfully",
        });
    }
    catch (error) {
        console.error("Delete reply error:", error);
        res.status(500).json({ error: "Failed to delete reply" });
    }
};
exports.deleteReply = deleteReply;
