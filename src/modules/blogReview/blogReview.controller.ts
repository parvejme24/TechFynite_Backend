import { Request, Response } from 'express';
import { BlogReviewService } from './blogReview.service';
import { createBlogReviewSchema, updateBlogReviewSchema } from './blogReview.types';

const blogReviewService = new BlogReviewService();

export class BlogReviewController {
  // Create a new blog review (No authentication required)
  async createBlogReview(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = createBlogReviewSchema.parse(req.body);

      // Generate a temporary user ID for anonymous reviews
      const tempUserId = `anonymous_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const review = await blogReviewService.createBlogReview(validatedData, tempUserId);

      res.status(201).json(review);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to create blog review',
      });
    }
  }

  // Get all reviews for a blog
  async getReviewsByBlogId(req: Request, res: Response) {
    try {
      const { blogId } = req.params;

      const reviews = await blogReviewService.getReviewsByBlogId(blogId);

      res.status(200).json(reviews);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch blog reviews',
      });
    }
  }

  // Get review by ID
  async getReviewById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const review = await blogReviewService.getReviewById(id);

      if (!review) {
        return res.status(404).json({
          success: false,
          message: 'Blog review not found',
        });
      }

      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch blog review',
      });
    }
  }

  // Update blog review (Only for authenticated users who own the review)
  async updateBlogReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Check if review exists
      const exists = await blogReviewService.reviewExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Blog review not found',
        });
      }

      // Check if user can modify this review
      const canModify = await blogReviewService.canUserModifyReview(id, user.id);
      if (!canModify) {
        return res.status(403).json({
          success: false,
          message: 'You can only modify your own reviews',
        });
      }

      // Validate request body
      const validatedData = updateBlogReviewSchema.parse(req.body);

      const review = await blogReviewService.updateBlogReview(id, validatedData);

      res.status(200).json(review);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }

      res.status(500).json({
        success: false,
        message: error.message || 'Failed to update blog review',
      });
    }
  }

  // Delete blog review (Only for authenticated users who own the review)
  async deleteBlogReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Check if review exists
      const exists = await blogReviewService.reviewExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Blog review not found',
        });
      }

      // Check if user can modify this review
      const canModify = await blogReviewService.canUserModifyReview(id, user.id);
      if (!canModify) {
        return res.status(403).json({
          success: false,
          message: 'You can only delete your own reviews',
        });
      }

      await blogReviewService.deleteBlogReview(id);

      res.status(200).json({
        success: true,
        message: 'Blog review deleted successfully',
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete blog review',
      });
    }
  }

  // Reply to blog review (Admin only)
  async replyToBlogReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = (req as any).user;

      if (!user || !user.id) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Check if user is admin
      if (user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Only admins can reply to reviews',
        });
      }

      // Check if review exists
      const exists = await blogReviewService.reviewExists(id);
      if (!exists) {
        return res.status(404).json({
          success: false,
          message: 'Blog review not found',
        });
      }

      const reply = {
        userName: user.displayName,
        photoUrl: user.photoUrl,
        ...req.body,
      };

      const review = await blogReviewService.updateBlogReview(id, { reply });

      res.status(200).json(review);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to reply to blog review',
      });
    }
  }
}
