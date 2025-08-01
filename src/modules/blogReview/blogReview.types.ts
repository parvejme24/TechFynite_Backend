import { z } from 'zod';

// Zod validation schemas
export const createBlogReviewSchema = z.object({
  blogId: z.string().min(1, 'Blog ID is required'),
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  photoUrl: z.string().optional(),
  commentText: z.string().min(1, 'Comment text is required'),
  reply: z.any().optional(),
});

export const updateBlogReviewSchema = z.object({
  commentText: z.string().min(1, 'Comment text is required').optional(),
  reply: z.any().optional(),
});

// TypeScript interfaces
export interface CreateBlogReviewRequest {
  blogId: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  commentText: string;
  reply?: any;
}

export interface UpdateBlogReviewRequest {
  commentText?: string;
  reply?: any;
}

export interface BlogReviewResponse {
  id: string;
  blogId: string;
  userId: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  commentText: string;
  reply?: any;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    displayName: string;
    email: string;
    photoUrl?: string;
  };
} 