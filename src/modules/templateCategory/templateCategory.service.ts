import { TemplateCategoryModel } from './templateCategory.model';
import { CreateTemplateCategoryRequest, UpdateTemplateCategoryRequest } from './templateCategory.types';

export const TemplateCategoryService = {
  getAll: () => TemplateCategoryModel.getAll(),
  getById: (id: string) => TemplateCategoryModel.getById(id),
  create: (data: CreateTemplateCategoryRequest) => TemplateCategoryModel.create(data),
  update: (id: string, data: UpdateTemplateCategoryRequest) => TemplateCategoryModel.update(id, data),
  delete: (id: string) => TemplateCategoryModel.delete(id),
};
