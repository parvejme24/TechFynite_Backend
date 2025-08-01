"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTemplateCategory = exports.updateTemplateCategory = exports.createTemplateCategory = exports.getTemplateCategoryById = exports.getAllTemplateCategories = void 0;
const templateCategory_service_1 = require("./templateCategory.service");
const getAllTemplateCategories = async (req, res) => {
    try {
        const categories = await templateCategory_service_1.TemplateCategoryService.getAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template categories' });
    }
};
exports.getAllTemplateCategories = getAllTemplateCategories;
const getTemplateCategoryById = async (req, res) => {
    try {
        const category = await templateCategory_service_1.TemplateCategoryService.getById(req.params.id);
        if (!category)
            return res.status(404).json({ error: 'Template category not found' });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch template category' });
    }
};
exports.getTemplateCategoryById = getTemplateCategoryById;
const createTemplateCategory = async (req, res) => {
    try {
        const { title, slug } = req.body;
        let imageUrl = req.file ? `/uploads/templateCategoryImage/${req.file.filename}` : undefined;
        const category = await templateCategory_service_1.TemplateCategoryService.create({ title, slug, imageUrl });
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create template category', details: error instanceof Error ? error.message : error });
    }
};
exports.createTemplateCategory = createTemplateCategory;
const updateTemplateCategory = async (req, res) => {
    try {
        const { title, slug } = req.body;
        let imageUrl = req.file ? `/uploads/templateCategoryImage/${req.file.filename}` : req.body.imageUrl;
        const category = await templateCategory_service_1.TemplateCategoryService.update(req.params.id, { title, slug, imageUrl });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update template category', details: error instanceof Error ? error.message : error });
    }
};
exports.updateTemplateCategory = updateTemplateCategory;
const deleteTemplateCategory = async (req, res) => {
    try {
        await templateCategory_service_1.TemplateCategoryService.delete(req.params.id);
        res.status(204).json({ message: 'Template category deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete template category' });
    }
};
exports.deleteTemplateCategory = deleteTemplateCategory;
