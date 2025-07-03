"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
exports.UserService = {
    getAll: () => user_model_1.UserModel.findAll(),
    getById: (id) => user_model_1.UserModel.findById(id),
    update: (id, data) => user_model_1.UserModel.update(id, data),
    updateRole: (id, data) => user_model_1.UserModel.updateRole(id, data.role),
};
