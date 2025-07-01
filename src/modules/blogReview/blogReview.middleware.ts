import { BlogReviewModel } from './blogReview.model';
import { Request, Response, NextFunction } from 'express';

export const checkReviewOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const review = await BlogReviewModel.findById(req.params.id);
  if (!review) return res.status(404).json({ error: "Review not found" });
  if (review.userId !== (req as any).user.userId) {
    return res.status(403).json({ error: "Not allowed" });
  }
  next();
}; 