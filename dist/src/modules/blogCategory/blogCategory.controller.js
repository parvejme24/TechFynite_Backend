"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlogCategory = exports.updateBlogCategory = exports.createBlogCategory = exports.getBlogCategoryById = exports.getAllBlogCategories = void 0;
const blogCategory_service_1 = require("./blogCategory.service");
const getAllBlogCategories = async (req, res) => {
    try {
        const categories = await blogCategory_service_1.BlogCategoryService.getAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch blog categories" });
    }
};
exports.getAllBlogCategories = getAllBlogCategories;
const getBlogCategoryById = async (req, res) => {
    try {
        const category = await blogCategory_service_1.BlogCategoryService.getById(req.params.id);
        if (!category)
            return res.status(404).json({ error: "Blog category not found" });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch blog category" });
    }
};
exports.getBlogCategoryById = getBlogCategoryById;
const createBlogCategory = async (req, res) => {
    try {
        const { title, slug } = req.body;
        let imageUrl = req.file ? `/uploads/blogCategoryImage/${req.file.filename}` : undefined;
        const category = await blogCategory_service_1.BlogCategoryService.create({
            title,
            slug,
            imageUrl,
        });
        res.status(201).json(category);
    }
    catch (error) {
        res
            .status(500)
            .json({
            error: "Failed to create blog category",
            details: error instanceof Error ? error.message : error,
        });
    }
};
exports.createBlogCategory = createBlogCategory;
const updateBlogCategory = async (req, res) => {
    try {
        const { title, slug } = req.body;
        let imageUrl = req.file
            ? `/uploads/blogCategoryImage/${req.file.filename}`
            : req.body.imageUrl;
        const category = await blogCategory_service_1.BlogCategoryService.update(req.params.id, {
            title,
            slug,
            imageUrl,
        });
        res.json(category);
    }
    catch (error) {
        res
            .status(500)
            .json({
            error: "Failed to update blog category",
            details: error instanceof Error ? error.message : error,
        });
    }
};
exports.updateBlogCategory = updateBlogCategory;
const deleteBlogCategory = async (req, res) => {
    try {
        await blogCategory_service_1.BlogCategoryService.delete(req.params.id);
        res.status(200).json({ message: "Blog category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete blog category" });
    }
};
exports.deleteBlogCategory = deleteBlogCategory;
