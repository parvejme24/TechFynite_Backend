import { Request, Response } from 'express';
import { BlogReviewService } from './blogReview.service';

const reviewResponse = (r: any) => ({
  blogId: r.blogId,
  userName: r.userName,
  commentDate: r.commentDate,
  photoUrl: r.photoUrl,
  commentText: r.commentText,
  reply: r.reply
});

export const getBlogReviewsByBlogId = async (req: Request, res: Response) => {
  try {
    const reviews = await BlogReviewService.getByBlogId(req.params.blogId);
    res.json(reviews.map(reviewResponse));
  } catch {
    res.status(500).json({ error: 'Failed to fetch blog reviews' });
  }
};

export const getBlogReviewById = async (req: Request, res: Response) => {
  try {
    const review = await BlogReviewService.getById(req.params.reviewId);
    if (!review) return res.status(404).json({ error: 'Blog review not found' });
    res.json(reviewResponse(review));
  } catch {
    res.status(500).json({ error: 'Failed to fetch blog review' });
  }
};

export const createBlogReview = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const review = await BlogReviewService.create({
      ...req.body,
      userName: user.displayName,
      photoUrl: user.photoUrl,
    });
    res.status(201).json(reviewResponse(review));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create blog review' });
  }
};

export const updateBlogReview = async (req: Request, res: Response) => {
  try {
    const review = await BlogReviewService.update(req.params.reviewId, req.body);
    res.json(reviewResponse(review));
  } catch {
    res.status(500).json({ error: 'Failed to update blog review' });
  }
};

export const deleteBlogReview = async (req: Request, res: Response) => {
  try {
    await BlogReviewService.delete(req.params.reviewId);
    res.status(204).send();
  } catch {
    res.status(500).json({ error: 'Failed to delete blog review' });
  }
};

export const replyToBlogReview = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const reply = {
      userName: user.displayName,
      photoUrl: user.photoUrl,
      ...req.body
    };
    const updated = await BlogReviewService.update(req.params.reviewId, { reply });
    res.json(reviewResponse(updated));
  } catch {
    res.status(500).json({ error: 'Failed to reply to blog review' });
  }
};

export const updateBlogReviewReply = async (req: Request, res: Response) => {
  try {
    const updated = await BlogReviewService.update(req.params.reviewId, { reply: req.body });
    res.json(reviewResponse(updated));
  } catch {
    res.status(500).json({ error: 'Failed to update blog review reply' });
  }
};
