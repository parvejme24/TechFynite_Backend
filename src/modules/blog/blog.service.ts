import { BlogModel } from './blog.model';
import { CreateBlogRequest, UpdateBlogRequest } from './blog.types';

export const BlogService = {
  getAll: () => BlogModel.findAll(),
  getById: (id: string) => BlogModel.findById(id),
  create: (data: CreateBlogRequest & { authorId: string }) => BlogModel.create(data),
  update: (id: string, data: UpdateBlogRequest) => BlogModel.update(id, data),
  delete: (id: string) => BlogModel.delete(id),
  likeBlog: (blogId: string, userId: string) => BlogModel.likeBlog(blogId, userId),
  unlikeBlog: (blogId: string, userId: string) => BlogModel.unlikeBlog(blogId, userId),
}; 