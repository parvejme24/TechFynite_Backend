import { PrismaClient } from '../../generated/prisma';
import { CreateBlogReviewRequest, UpdateBlogReviewRequest, BlogReviewResponse } from './blogReview.types';

const prisma = new PrismaClient();

export class BlogReviewService {
  // Create a new blog review
  async createBlogReview(data: CreateBlogReviewRequest, userId: string): Promise<BlogReviewResponse> {
    try {
      const blogReview = await prisma.blogReview.create({
        data: {
          blogId: data.blogId,
          userId: userId,
          fullName: data.fullName,
          email: data.email,
          photoUrl: data.photoUrl,
          commentText: data.commentText,
          reply: data.reply,
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              photoUrl: true,
            },
          },
        },
      });

      return blogReview as BlogReviewResponse;
    } catch (error) {
      throw new Error(`Failed to create blog review: ${error}`);
    }
  }

  // Get all reviews for a blog
  async getReviewsByBlogId(blogId: string): Promise<BlogReviewResponse[]> {
    try {
      const reviews = await prisma.blogReview.findMany({
        where: { blogId },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              photoUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return reviews as BlogReviewResponse[];
    } catch (error) {
      throw new Error(`Failed to fetch blog reviews: ${error}`);
    }
  }

  // Get review by ID
  async getReviewById(id: string): Promise<BlogReviewResponse | null> {
    try {
      const review = await prisma.blogReview.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              photoUrl: true,
            },
          },
        },
      });

      return review as BlogReviewResponse | null;
    } catch (error) {
      throw new Error(`Failed to fetch blog review: ${error}`);
    }
  }

  // Update blog review
  async updateBlogReview(id: string, data: UpdateBlogReviewRequest): Promise<BlogReviewResponse> {
    try {
      const review = await prisma.blogReview.update({
        where: { id },
        data: {
          ...(data.commentText && { commentText: data.commentText }),
          ...(data.reply !== undefined && { reply: data.reply }),
        },
        include: {
          user: {
            select: {
              id: true,
              displayName: true,
              email: true,
              photoUrl: true,
            },
          },
        },
      });

      return review as BlogReviewResponse;
    } catch (error) {
      throw new Error(`Failed to update blog review: ${error}`);
    }
  }

  // Delete blog review
  async deleteBlogReview(id: string): Promise<boolean> {
    try {
      await prisma.blogReview.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      throw new Error(`Failed to delete blog review: ${error}`);
    }
  }

  // Check if review exists
  async reviewExists(id: string): Promise<boolean> {
    try {
      const count = await prisma.blogReview.count({
        where: { id },
      });

      return count > 0;
    } catch (error) {
      throw new Error(`Failed to check review existence: ${error}`);
    }
  }

  // Check if user can modify review (owner check)
  async canUserModifyReview(reviewId: string, userId: string): Promise<boolean> {
    try {
      const review = await prisma.blogReview.findUnique({
        where: { id: reviewId },
        select: { userId: true },
      });

      return review?.userId === userId;
    } catch (error) {
      throw new Error(`Failed to check review ownership: ${error}`);
    }
  }
} 