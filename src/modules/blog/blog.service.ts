import { BlogModel } from './blog.model';
import { CreateBlogRequest, UpdateBlogRequest } from './blog.types';

export const BlogService = {
  getAll: async () => {
    return BlogModel.getAll();
  },
  getById: async (id: string) => {
    return BlogModel.getById(id);
  },
  create: async (data: CreateBlogRequest) => {
    return BlogModel.create(data);
  },
  update: async (id: string, data: UpdateBlogRequest) => {
    return BlogModel.update(id, data);
  },
  delete: async (id: string) => {
    return BlogModel.delete(id);
  },
  likeBlog: async (blogId: string, userId: string) => {
    return BlogModel.likeBlog(blogId, userId);
  },
  unlikeBlog: async (blogId: string, userId: string) => {
    return BlogModel.unlikeBlog(blogId, userId);
  },
};
