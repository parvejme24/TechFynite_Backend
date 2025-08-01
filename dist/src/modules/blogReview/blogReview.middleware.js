"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReplyOwnership = exports.checkReviewOwnership = void 0;
const blogReview_model_1 = require("./blogReview.model");
const checkReviewOwnership = async (req, res, next) => {
    const review = await blogReview_model_1.BlogReviewModel.getById(req.params.reviewId);
    if (!review)
        return res.status(404).json({ error: 'Review not found' });
    // Handle anonymous reviews (userId can be null)
    if (!review.userId) {
        return res.status(403).json({ error: 'Anonymous reviews cannot be modified' });
    }
    if (review.userId !== req.user.id) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    next();
};
exports.checkReviewOwnership = checkReviewOwnership;
const checkReplyOwnership = async (req, res, next) => {
    const review = await blogReview_model_1.BlogReviewModel.getById(req.params.reviewId);
    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }
    // Find the specific reply by replyId
    const replyId = req.params.replyId;
    const replies = review.replies || [];
    const reply = replies.find((r) => r.id === replyId);
    if (!reply) {
        return res.status(404).json({ error: 'Reply not found' });
    }
    // Check if the current user is the admin who created the reply
    if (reply.admin.id !== req.user.userId) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    next();
};
exports.checkReplyOwnership = checkReplyOwnership;
