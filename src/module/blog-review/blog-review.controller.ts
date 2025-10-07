import { Request, Response } from "express";
import { blogReviewService } from "./blog-review.service";
import { IBlogReviewQuery } from "./blog-review.interface";

// Create blog review
export const createBlogReview = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const reviewData = { ...req.body, blogId };

    // Check if user has already reviewed this blog
    const hasReviewed = await blogReviewService.hasUserReviewed(blogId, reviewData.userId);
    if (hasReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this blog",
        error: "Duplicate review not allowed"
      });
    }

    const review = await blogReviewService.createBlogReview(reviewData);

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Error creating blog review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create blog review reply
export const createBlogReviewReply = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    const adminId = (req as any).user?.id;
    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
        error: "Admin user not found in context",
      });
    }
    const replyData = { ...req.body, reviewId, adminId } as any;

    const reply = await blogReviewService.createBlogReviewReply(replyData);

    return res.status(201).json({
      success: true,
      message: "Reply submitted successfully.",
      data: reply,
    });
  } catch (error) {
    console.error("Error creating blog review reply:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create blog review reply",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blog reviews
export const getBlogReviews = async (req: Request, res: Response) => {
  try {
    const query: IBlogReviewQuery = (req as any).validatedQuery || req.query;
    const result = await blogReviewService.getBlogReviews(query);

    return res.status(200).json({
      success: true,
      message: "Blog reviews fetched successfully",
      data: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching blog reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get reviews by blog ID
export const getReviewsByBlogId = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const query: IBlogReviewQuery = (req as any).validatedQuery || req.query;
    
    const result = await blogReviewService.getReviewsByBlogId(blogId, query);

    return res.status(200).json({
      success: true,
      message: "Blog reviews fetched successfully",
      data: result.reviews,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error fetching blog reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog reviews",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blog review by ID
export const getBlogReviewById = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    const review = await blogReviewService.getBlogReviewById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review fetched successfully",
      data: review,
    });
  } catch (error) {
    console.error("Error fetching blog review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Update review approval status (admin only)
// Approval endpoints removed

// Delete blog review
export const deleteBlogReview = async (req: Request, res: Response) => {
  try {
    const { reviewId } = req.params;
    
    const deleted = await blogReviewService.deleteBlogReview(reviewId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting blog review:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog review",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete blog review reply
export const deleteBlogReviewReply = async (req: Request, res: Response) => {
  try {
    const { replyId } = req.params;
    
    const deleted = await blogReviewService.deleteBlogReviewReply(replyId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Reply deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting blog review reply:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete blog review reply",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get blog review statistics
export const getBlogReviewStats = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.query;
    
    const stats = await blogReviewService.getBlogReviewStats(blogId as string);

    return res.status(200).json({
      success: true,
      message: "Blog review statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching blog review statistics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch blog review statistics",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
