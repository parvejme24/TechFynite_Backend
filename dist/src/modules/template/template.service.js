"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateService = void 0;
const template_model_1 = require("./template.model");
exports.TemplateService = {
    getAll: () => template_model_1.TemplateModel.getAll(),
    getById: (id) => template_model_1.TemplateModel.getById(id),
    getBySlug: (slug) => template_model_1.TemplateModel.getBySlug(slug),
    getByCategory: (categoryId) => template_model_1.TemplateModel.getByCategory(categoryId),
    create: (data) => template_model_1.TemplateModel.create(data),
    update: (id, data) => template_model_1.TemplateModel.update(id, data),
    delete: (id) => template_model_1.TemplateModel.delete(id),
};
