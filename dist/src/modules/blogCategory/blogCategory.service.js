"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogCategoryService = void 0;
const blogCategory_model_1 = require("./blogCategory.model");
exports.BlogCategoryService = {
    getAll: async () => {
        return blogCategory_model_1.BlogCategoryModel.getAll();
    },
    getById: async (id) => {
        return blogCategory_model_1.BlogCategoryModel.getById(id);
    },
    create: async (data) => {
        return blogCategory_model_1.BlogCategoryModel.create(data);
    },
    update: async (id, data) => {
        return blogCategory_model_1.BlogCategoryModel.update(id, data);
    },
    delete: async (id) => {
        return blogCategory_model_1.BlogCategoryModel.delete(id);
    },
};
