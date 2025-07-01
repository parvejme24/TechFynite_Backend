import { BlogReviewModel } from './blogReview.model';
import { CreateBlogReviewRequest, UpdateBlogReviewRequest } from './blogReview.types';

export const BlogReviewService = {
  getByBlogId: (blogId: string) => BlogReviewModel.findByBlogId(blogId),
  getById: (id: string) => BlogReviewModel.findById(id),
  create: (data: CreateBlogReviewRequest) => BlogReviewModel.create(data),
  update: (id: string, data: UpdateBlogReviewRequest) => BlogReviewModel.update(id, data),
  delete: (id: string) => BlogReviewModel.delete(id),
}; 