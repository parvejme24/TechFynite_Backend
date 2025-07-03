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
exports.checkReplyOwnership = exports.checkReviewOwnership = void 0;
const blogReview_model_1 = require("./blogReview.model");
const checkReviewOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield blogReview_model_1.BlogReviewModel.findById(req.params.reviewId);
    if (!review)
        return res.status(404).json({ error: 'Review not found' });
    if (review.userName !== req.user.displayName) {
        return res.status(403).json({ error: 'Not allowed' });
    }
    next();
});
exports.checkReviewOwnership = checkReviewOwnership;
const checkReplyOwnership = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield blogReview_model_1.BlogReviewModel.findById(req.params.reviewId);
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
});
exports.checkReplyOwnership = checkReplyOwnership;
