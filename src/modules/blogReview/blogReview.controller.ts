import { Request, Response } from "express";
import { BlogReviewModel } from "./blogReview.model";
import { BlogReviewInput } from "../blog/blog.types";

export const createBlogReview = async (req: Request, res: Response) => {
  try {
    const { blogId, commentText, rating, fullName, email, photoUrl } = req.body;

    // Validate required fields
    if (!blogId) {
      return res.status(400).json({ error: "Blog ID is required" });
    }
    if (!commentText) {
      return res.status(400).json({ error: "Comment text is required" });
    }
    if (!fullName) {
      return res.status(400).json({ error: "Full name is required" });
    }
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if user is authenticated
    const user = (req as any).user;
    let userId = null;
    let reviewData: BlogReviewInput;

    if (user) {
      // Authenticated user
      reviewData = {
        blogId,
        userId: user.userId,
        fullName: user.displayName || fullName,
        email: user.email || email,
        photoUrl: user.photoUrl || photoUrl,
        commentText,
        rating: rating || 5,
      };
    } else {
      // Anonymous user - no userId needed
      reviewData = {
        blogId,
        fullName,
        email,
        photoUrl,
        commentText,
        rating: rating || 5,
      };
    }

    const review = await BlogReviewModel.create(reviewData);
    res.status(201).json(review);
  } catch (error) {
    console.error("Create blog review error:", error);
    res.status(500).json({
      error: "Failed to create blog review",
      details: error instanceof Error ? error.message : error,
    });
  }
};

export const getBlogReviews = async (req: Request, res: Response) => {
  try {
    const { blogId } = req.params;
    const reviews = await BlogReviewModel.getByBlogId(blogId);
    res.json(reviews);
  } catch (error) {
    console.error("Fetch blog reviews error:", error);
    res.status(500).json({ error: "Failed to fetch blog reviews" });
  }
};

export const updateBlogReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User not authenticated" });
    }

    const { commentText, rating } = req.body;

    // Validate rating if provided
    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Check if review exists and user owns it
    const existingReview = await BlogReviewModel.getById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    if (existingReview.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only edit your own reviews" });
    }

    const review = await BlogReviewModel.update(req.params.id, {
      commentText,
      rating,
    });
    res.json(review);
  } catch (error) {
    console.error("Update blog review error:", error);
    res.status(500).json({ error: "Failed to update blog review" });
  }
};

export const deleteBlogReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized - User not authenticated" });
    }

    // Check if review exists
    const existingReview = await BlogReviewModel.getById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Check if user owns the review or is admin
    const user = (req as any).user;
    if (
      existingReview.userId !== userId &&
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return res
        .status(403)
        .json({ error: "You can only delete your own reviews" });
    }

    await BlogReviewModel.delete(req.params.id);
    res.status(200).json({ message: "Blog review deleted successfully" });
  } catch (error) {
    console.error("Delete blog review error:", error);
    res.status(500).json({ error: "Failed to delete blog review" });
  }
};

// Admin reply to review
export const replyToReview = async (req: Request, res: Response) => {
  try {
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ error: "Reply text is required" });
    }

    // Check if review exists
    const existingReview = await BlogReviewModel.getById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ error: "Review not found" });
    }

    // Create a new reply using the new model structure
    const reply = await BlogReviewModel.createReply(
      req.params.id,
      (req as any).user.userId,
      replyText
    );

    // Get the updated review with all replies
    const review = await BlogReviewModel.getById(req.params.id);

    res.json({
      message: "Reply added successfully",
      reply,
      review,
    });
  } catch (error) {
    console.error("Reply to review error:", error);
    res.status(500).json({ error: "Failed to reply to review" });
  }
};

// Update reply (admin only)
export const updateReply = async (req: Request, res: Response) => {
  try {
    const { replyText } = req.body;

    if (!replyText) {
      return res.status(400).json({ error: "Reply text is required" });
    }

    const reply = await BlogReviewModel.updateReply(
      req.params.replyId,
      replyText
    );

    res.json({
      message: "Reply updated successfully",
      reply,
    });
  } catch (error) {
    console.error("Update reply error:", error);
    res.status(500).json({ error: "Failed to update reply" });
  }
};

// Delete reply (admin only)
export const deleteReply = async (req: Request, res: Response) => {
  try {
    await BlogReviewModel.deleteReply(req.params.replyId);

    res.json({
      message: "Reply deleted successfully",
    });
  } catch (error) {
    console.error("Delete reply error:", error);
    res.status(500).json({ error: "Failed to delete reply" });
  }
};
