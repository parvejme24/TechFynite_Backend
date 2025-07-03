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
exports.deleteTemplateCategory = exports.updateTemplateCategory = exports.createTemplateCategory = exports.getTemplateCategoryById = exports.getAllTemplateCategories = void 0;
const templateCategory_service_1 = require("./templateCategory.service");
const getAllTemplateCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield templateCategory_service_1.TemplateCategoryService.getAll();
        res.json(categories);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch template categories" });
    }
});
exports.getAllTemplateCategories = getAllTemplateCategories;
const getTemplateCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield templateCategory_service_1.TemplateCategoryService.getById(req.params.id);
        if (!category)
            return res.status(404).json({ error: "Template category not found" });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch template category" });
    }
});
exports.getTemplateCategoryById = getTemplateCategoryById;
const createTemplateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield templateCategory_service_1.TemplateCategoryService.create(req.body);
        res.status(201).json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create template category" });
    }
});
exports.createTemplateCategory = createTemplateCategory;
const updateTemplateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield templateCategory_service_1.TemplateCategoryService.update(req.params.id, req.body);
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to update template category" });
    }
});
exports.updateTemplateCategory = updateTemplateCategory;
const deleteTemplateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield templateCategory_service_1.TemplateCategoryService.delete(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: "Failed to delete template category" });
    }
});
exports.deleteTemplateCategory = deleteTemplateCategory;
