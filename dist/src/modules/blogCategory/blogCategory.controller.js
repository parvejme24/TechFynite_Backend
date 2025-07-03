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
exports.deleteBlogCategory = exports.updateBlogCategory = exports.createBlogCategory = exports.getBlogCategoryById = exports.getAllBlogCategories = void 0;
const blogCategory_service_1 = require("./blogCategory.service");
const getAllBlogCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield blogCategory_service_1.BlogCategoryService.getAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch blog categories" });
    }
});
exports.getAllBlogCategories = getAllBlogCategories;
const getBlogCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogCategory_service_1.BlogCategoryService.getById(req.params.id);
        if (!category)
            return res.status(404).json({ error: "Blog category not found" });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch blog category" });
    }
});
exports.getBlogCategoryById = getBlogCategoryById;
const createBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogCategory_service_1.BlogCategoryService.create(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create blog category" });
    }
});
exports.createBlogCategory = createBlogCategory;
const updateBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield blogCategory_service_1.BlogCategoryService.update(req.params.id, req.body);
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update blog category" });
    }
});
exports.updateBlogCategory = updateBlogCategory;
const deleteBlogCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield blogCategory_service_1.BlogCategoryService.delete(req.params.id);
        res.status(204).json({ message: "Blog category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete blog category" });
    }
});
exports.deleteBlogCategory = deleteBlogCategory;
