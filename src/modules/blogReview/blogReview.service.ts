import { BlogReviewModel } from './blogReview.model';
import { CreateBlogReviewRequest, UpdateBlogReviewRequest } from './blogReview.types';

export const BlogReviewService = {
  getAll: () => BlogReviewModel.findAll(),
  getById: (id: string) => BlogReviewModel.findById(id),
  create: (data: CreateBlogReviewRequest) => BlogReviewModel.create(data),
  update: (id: string, data: UpdateBlogReviewRequest) => BlogReviewModel.update(id, data),
  delete: (id: string) => BlogReviewModel.delete(id),
}; 