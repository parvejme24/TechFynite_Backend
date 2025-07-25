import { BlogCategoryModel } from './blogCategory.model';
import { CreateBlogCategoryRequest, UpdateBlogCategoryRequest } from './blogCategory.types';

export const BlogCategoryService = {
  getAll: async () => {
    return BlogCategoryModel.getAll();
  },
  getById: async (id: string) => {
    return BlogCategoryModel.getById(id);
  },
  create: async (data: CreateBlogCategoryRequest) => {
    return BlogCategoryModel.create(data);
  },
  update: async (id: string, data: UpdateBlogCategoryRequest) => {
    return BlogCategoryModel.update(id, data);
  },
  delete: async (id: string) => {
    return BlogCategoryModel.delete(id);
  },
};
