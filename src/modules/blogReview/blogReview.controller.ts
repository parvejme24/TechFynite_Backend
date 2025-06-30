import { Request, Response } from 'express';
import { BlogReviewService } from './blogReview.service';

export const getAllBlogReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await BlogReviewService.getAll();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog reviews' });
  }
};

export const getBlogReviewById = async (req: Request, res: Response) => {
  try {
    const review = await BlogReviewService.getById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Blog review not found' });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog review' });
  }
};

export const createBlogReview = async (req: Request, res: Response) => {
  try {
    const review = await BlogReviewService.create(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog review' });
  }
};

export const updateBlogReview = async (req: Request, res: Response) => {
  try {
    const review = await BlogReviewService.update(req.params.id, req.body);
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog review' });
  }
};

export const deleteBlogReview = async (req: Request, res: Response) => {
  try {
    await BlogReviewService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog review' });
  }
}; 