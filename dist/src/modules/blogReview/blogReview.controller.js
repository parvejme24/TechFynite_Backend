"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogReviewReply = exports.replyToBlogReview = exports.deleteBlogReview = exports.updateBlogReview = exports.createBlogReview = exports.getBlogReviewById = exports.getBlogReviewsByBlogId = void 0;
const blogReview_service_1 = require("./blogReview.service");
const reviewResponse = (r) => ({
    blogId: r.blogId,
    userName: r.userName,
    commentDate: r.commentDate,
    photoUrl: r.photoUrl,
    commentText: r.commentText,
    reply: r.reply
});
const getBlogReviewsByBlogId = async (req, res) => {
    try {
        const reviews = await blogReview_service_1.BlogReviewService.getByBlogId(req.params.blogId);
        res.json(reviews.map(reviewResponse));
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch blog reviews' });
    }
};
exports.getBlogReviewsByBlogId = getBlogReviewsByBlogId;
const getBlogReviewById = async (req, res) => {
    try {
        const review = await blogReview_service_1.BlogReviewService.getById(req.params.reviewId);
        if (!review)
            return res.status(404).json({ error: 'Blog review not found' });
        res.json(reviewResponse(review));
    }
    catch {
        res.status(500).json({ error: 'Failed to fetch blog review' });
    }
};
exports.getBlogReviewById = getBlogReviewById;
const createBlogReview = async (req, res) => {
    try {
        const user = req.user;
        const review = await blogReview_service_1.BlogReviewService.create({
            ...req.body,
            userName: user.displayName,
            photoUrl: user.photoUrl,
        });
        res.status(201).json(reviewResponse(review));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create blog review' });
    }
};
exports.createBlogReview = createBlogReview;
const updateBlogReview = async (req, res) => {
    try {
        const review = await blogReview_service_1.BlogReviewService.update(req.params.reviewId, req.body);
        res.json(reviewResponse(review));
    }
    catch {
        res.status(500).json({ error: 'Failed to update blog review' });
    }
};
exports.updateBlogReview = updateBlogReview;
const deleteBlogReview = async (req, res) => {
    try {
        await blogReview_service_1.BlogReviewService.delete(req.params.reviewId);
        res.status(204).send();
    }
    catch {
        res.status(500).json({ error: 'Failed to delete blog review' });
    }
};
exports.deleteBlogReview = deleteBlogReview;
const replyToBlogReview = async (req, res) => {
    try {
        const user = req.user;
        const reply = {
            userName: user.displayName,
            photoUrl: user.photoUrl,
            ...req.body
        };
        const updated = await blogReview_service_1.BlogReviewService.update(req.params.reviewId, { reply });
        res.json(reviewResponse(updated));
    }
    catch {
        res.status(500).json({ error: 'Failed to reply to blog review' });
    }
};
exports.replyToBlogReview = replyToBlogReview;
const updateBlogReviewReply = async (req, res) => {
    try {
        const updated = await blogReview_service_1.BlogReviewService.update(req.params.reviewId, { reply: req.body });
        res.json(reviewResponse(updated));
    }
    catch {
        res.status(500).json({ error: 'Failed to update blog review reply' });
    }
};
exports.updateBlogReviewReply = updateBlogReviewReply;
