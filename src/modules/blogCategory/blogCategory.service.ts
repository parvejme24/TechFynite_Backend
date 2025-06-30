import { BlogCategoryModel } from './blogCategory.model';
import { CreateBlogCategoryRequest, UpdateBlogCategoryRequest } from './blogCategory.types';

export const BlogCategoryService = {
  getAll: () => BlogCategoryModel.findAll(),
  getById: (id: string) => BlogCategoryModel.findById(id),
  create: (data: CreateBlogCategoryRequest) => BlogCategoryModel.create(data),
  update: (id: string, data: UpdateBlogCategoryRequest) => BlogCategoryModel.update(id, data),
  delete: (id: string) => BlogCategoryModel.delete(id),
}; 