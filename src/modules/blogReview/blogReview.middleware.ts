import { Request, Response, NextFunction } from 'express';
import { BlogReviewModel } from './blogReview.model';

export const checkReviewOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const review = await BlogReviewModel.getById(req.params.reviewId);
  if (!review) return res.status(404).json({ error: 'Review not found' });
  if (review.userId !== (req as any).user.id) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  next();
};

export const checkReplyOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const review = await BlogReviewModel.getById(req.params.reviewId);
  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }
  
  // Find the specific reply by replyId
  const replyId = req.params.replyId;
  const reply = review.replies?.find(r => r.id === replyId);
  
  if (!reply) {
    return res.status(404).json({ error: 'Reply not found' });
  }
  
  // Check if the current user is the admin who created the reply
  if (reply.admin.id !== (req as any).user.userId) {
    return res.status(403).json({ error: 'Not allowed' });
  }
  
  next();
}; 