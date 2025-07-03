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
exports.unlikeBlog = exports.likeBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const blog_service_1 = require("./blog.service");
const getAllBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_service_1.BlogService.getAll();
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});
exports.getAllBlogs = getAllBlogs;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_service_1.BlogService.getById(req.params.id);
        if (!blog)
            return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
});
exports.getBlogById = getBlogById;
const createBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authorId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const blog = yield blog_service_1.BlogService.create(Object.assign(Object.assign({}, req.body), { authorId }));
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create blog' });
    }
});
exports.createBlog = createBlog;
const updateBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blog = yield blog_service_1.BlogService.update(req.params.id, req.body);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield blog_service_1.BlogService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
});
exports.deleteBlog = deleteBlog;
const likeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const blogId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const blog = yield blog_service_1.BlogService.likeBlog(blogId, userId);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to like blog' });
    }
});
exports.likeBlog = likeBlog;
const unlikeBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const blogId = req.params.id;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const blog = yield blog_service_1.BlogService.unlikeBlog(blogId, userId);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to unlike blog' });
    }
});
exports.unlikeBlog = unlikeBlog;
