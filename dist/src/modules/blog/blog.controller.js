"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeBlog = exports.likeBlog = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogById = exports.getAllBlogs = void 0;
const blog_service_1 = require("./blog.service");
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await blog_service_1.BlogService.getAll();
        res.json(blogs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
};
exports.getAllBlogs = getAllBlogs;
const getBlogById = async (req, res) => {
    try {
        const blog = await blog_service_1.BlogService.getById(req.params.id);
        if (!blog)
            return res.status(404).json({ error: 'Blog not found' });
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch blog' });
    }
};
exports.getBlogById = getBlogById;
const createBlog = async (req, res) => {
    try {
        const authorId = req.user?.userId;
        const blog = await blog_service_1.BlogService.create({ ...req.body, authorId });
        res.status(201).json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create blog' });
    }
};
exports.createBlog = createBlog;
const updateBlog = async (req, res) => {
    try {
        const blog = await blog_service_1.BlogService.update(req.params.id, req.body);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update blog' });
    }
};
exports.updateBlog = updateBlog;
const deleteBlog = async (req, res) => {
    try {
        await blog_service_1.BlogService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete blog' });
    }
};
exports.deleteBlog = deleteBlog;
const likeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const blog = await blog_service_1.BlogService.likeBlog(blogId, userId);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to like blog' });
    }
};
exports.likeBlog = likeBlog;
const unlikeBlog = async (req, res) => {
    try {
        const blogId = req.params.id;
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const blog = await blog_service_1.BlogService.unlikeBlog(blogId, userId);
        res.json(blog);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to unlike blog' });
    }
};
exports.unlikeBlog = unlikeBlog;
