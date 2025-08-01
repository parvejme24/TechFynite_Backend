"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogReviewRoutes = exports.BlogReviewModel = exports.deleteReply = exports.updateReply = exports.replyToReview = exports.deleteBlogReview = exports.updateBlogReview = exports.getBlogReviews = exports.createBlogReview = void 0;
var blogReview_controller_1 = require("./blogReview.controller");
Object.defineProperty(exports, "createBlogReview", { enumerable: true, get: function () { return blogReview_controller_1.createBlogReview; } });
Object.defineProperty(exports, "getBlogReviews", { enumerable: true, get: function () { return blogReview_controller_1.getBlogReviews; } });
Object.defineProperty(exports, "updateBlogReview", { enumerable: true, get: function () { return blogReview_controller_1.updateBlogReview; } });
Object.defineProperty(exports, "deleteBlogReview", { enumerable: true, get: function () { return blogReview_controller_1.deleteBlogReview; } });
Object.defineProperty(exports, "replyToReview", { enumerable: true, get: function () { return blogReview_controller_1.replyToReview; } });
Object.defineProperty(exports, "updateReply", { enumerable: true, get: function () { return blogReview_controller_1.updateReply; } });
Object.defineProperty(exports, "deleteReply", { enumerable: true, get: function () { return blogReview_controller_1.deleteReply; } });
var blogReview_model_1 = require("./blogReview.model");
Object.defineProperty(exports, "BlogReviewModel", { enumerable: true, get: function () { return blogReview_model_1.BlogReviewModel; } });
__exportStar(require("./blogReview.types"), exports);
var blogReview_routes_1 = require("./blogReview.routes");
Object.defineProperty(exports, "blogReviewRoutes", { enumerable: true, get: function () { return __importDefault(blogReview_routes_1).default; } });
