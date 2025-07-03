"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogReviewService = void 0;
const blogReview_model_1 = require("./blogReview.model");
exports.BlogReviewService = {
    getByBlogId: (blogId) => blogReview_model_1.BlogReviewModel.findByBlogId(blogId),
    getById: (id) => blogReview_model_1.BlogReviewModel.findById(id),
    create: (data) => blogReview_model_1.BlogReviewModel.create(data),
    update: (id, data) => blogReview_model_1.BlogReviewModel.update(id, data),
    delete: (id) => blogReview_model_1.BlogReviewModel.delete(id),
};
