"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReplyOwnership = exports.checkReviewOwnership = void 0;
const blogReview_model_1 = require("./blogReview.model");
const checkReviewOwnership = async (req, res, next) => {
    const review = await blogReview_model_1.BlogReviewModel.findById(req.params.reviewId);
    if (!review)
        return res.status(404).json({ error: 'Review not found' });
    if (review.userName !== req.user.displayName) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    next();
};
exports.checkReviewOwnership = checkReviewOwnership;
const checkReplyOwnership = async (req, res, next) => {
    const review = await blogReview_model_1.BlogReviewModel.findById(req.params.reviewId);
    if (!review ||
        typeof review.reply !== 'object' ||
        review.reply === null ||
        !('userName' in review.reply)) {
        return res.status(404).json({ error: 'Reply not found' });
    }
    if (review.reply.userName !== req.user.displayName) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    next();
};
exports.checkReplyOwnership = checkReplyOwnership;
