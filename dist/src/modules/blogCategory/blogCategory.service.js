"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryService = void 0;
const blogCategory_model_1 = require("./blogCategory.model");
exports.BlogCategoryService = {
    getAll: () => blogCategory_model_1.BlogCategoryModel.findAll(),
    getById: (id) => blogCategory_model_1.BlogCategoryModel.findById(id),
    create: (data) => blogCategory_model_1.BlogCategoryModel.create(data),
    update: (id, data) => blogCategory_model_1.BlogCategoryModel.update(id, data),
    delete: (id) => blogCategory_model_1.BlogCategoryModel.delete(id),
};
