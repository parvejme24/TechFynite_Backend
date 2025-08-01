"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCategoryService = void 0;
const templateCategory_model_1 = require("./templateCategory.model");
exports.TemplateCategoryService = {
    getAll: () => templateCategory_model_1.TemplateCategoryModel.getAll(),
    getById: (id) => templateCategory_model_1.TemplateCategoryModel.getById(id),
    create: (data) => templateCategory_model_1.TemplateCategoryModel.create(data),
    update: (id, data) => templateCategory_model_1.TemplateCategoryModel.update(id, data),
    delete: (id) => templateCategory_model_1.TemplateCategoryModel.delete(id),
};
