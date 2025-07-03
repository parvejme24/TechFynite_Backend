"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_model_1 = require("./blog.model");
exports.BlogService = {
    getAll: () => blog_model_1.BlogModel.findAll(),
    getById: (id) => blog_model_1.BlogModel.findById(id),
    create: (data) => blog_model_1.BlogModel.create(data),
    update: (id, data) => blog_model_1.BlogModel.update(id, data),
    delete: (id) => blog_model_1.BlogModel.delete(id),
    likeBlog: (blogId, userId) => blog_model_1.BlogModel.likeBlog(blogId, userId),
    unlikeBlog: (blogId, userId) => blog_model_1.BlogModel.unlikeBlog(blogId, userId),
};
