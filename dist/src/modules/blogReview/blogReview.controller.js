"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const getBlogReviewsByBlogId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reviews = yield blogReview_service_1.BlogReviewService.getByBlogId(req.params.blogId);
        res.json(reviews.map(reviewResponse));
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch blog reviews' });
    }
});
exports.getBlogReviewsByBlogId = getBlogReviewsByBlogId;
const getBlogReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield blogReview_service_1.BlogReviewService.getById(req.params.reviewId);
        if (!review)
            return res.status(404).json({ error: 'Blog review not found' });
        res.json(reviewResponse(review));
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to fetch blog review' });
    }
});
exports.getBlogReviewById = getBlogReviewById;
const createBlogReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const review = yield blogReview_service_1.BlogReviewService.create(Object.assign(Object.assign({}, req.body), { userName: user.displayName, photoUrl: user.photoUrl }));
        res.status(201).json(reviewResponse(review));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create blog review' });
    }
});
exports.createBlogReview = createBlogReview;
const updateBlogReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const review = yield blogReview_service_1.BlogReviewService.update(req.params.reviewId, req.body);
        res.json(reviewResponse(review));
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to update blog review' });
    }
});
exports.updateBlogReview = updateBlogReview;
const deleteBlogReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield blogReview_service_1.BlogReviewService.delete(req.params.reviewId);
        res.status(204).send();
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to delete blog review' });
    }
});
exports.deleteBlogReview = deleteBlogReview;
const replyToBlogReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const reply = Object.assign({ userName: user.displayName, photoUrl: user.photoUrl }, req.body);
        const updated = yield blogReview_service_1.BlogReviewService.update(req.params.reviewId, { reply });
        res.json(reviewResponse(updated));
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to reply to blog review' });
    }
});
exports.replyToBlogReview = replyToBlogReview;
const updateBlogReviewReply = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updated = yield blogReview_service_1.BlogReviewService.update(req.params.reviewId, { reply: req.body });
        res.json(reviewResponse(updated));
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to update blog review reply' });
    }
});
exports.updateBlogReviewReply = updateBlogReviewReply;
