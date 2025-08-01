"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const blog_model_1 = require("./blog.model");
exports.BlogService = {
    getAll: async () => {
        return blog_model_1.BlogModel.getAll();
    },
    getById: async (id) => {
        return blog_model_1.BlogModel.getById(id);
    },
    create: async (data) => {
        return blog_model_1.BlogModel.create(data);
    },
    update: async (id, data) => {
        return blog_model_1.BlogModel.update(id, data);
    },
    delete: async (id) => {
        return blog_model_1.BlogModel.delete(id);
    },
    likeBlog: async (blogId, userId) => {
        return blog_model_1.BlogModel.likeBlog(blogId, userId);
    },
    unlikeBlog: async (blogId, userId) => {
        return blog_model_1.BlogModel.unlikeBlog(blogId, userId);
    },
};
