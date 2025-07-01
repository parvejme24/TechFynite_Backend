import { Request, Response, NextFunction } from 'express';
import { BlogReviewModel } from './blogReview.model';

export const checkReviewOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const review = await BlogReviewModel.findById(req.params.reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.userName !== (req as any).user.displayName) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  next();
};

export const checkReplyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const review = await BlogReviewModel.findById(req.params.reviewId);
  if (
    !review ||
    typeof review.reply !== 'object' ||
    review.reply === null ||
    !('userName' in review.reply)
  ) {
    return res.status(404).json({ error: 'Reply not found' });
  }
  if (review.reply.userName !== (req as any).user.displayName) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  next();
}; 