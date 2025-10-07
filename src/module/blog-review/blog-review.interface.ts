export interface IBlogReview {
  id: string;
  blogId: string;
  userId: string;
  rating: number;
  commentText: string;
  fullName: string;
  email: string;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  replies?: IBlogReviewReply[];
}

export interface IBlogReviewReply {
  id: string;
  reviewId: string;
  replyText: string;
  // Optional fields depend on who replied (user/admin) and schema shape
  userId?: string | null;
  adminId?: string | null;
  fullName?: string | null;
  email?: string | null;
  photoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateBlogReview {
  blogId: string;
  userId?: string;
  rating: number;
  commentText: string;
  fullName: string;
  email: string;
}

export interface ICreateBlogReviewReply {
  reviewId: string;
  userId?: string;
  replyText: string;
  fullName: string;
  email: string;
}

export interface IBlogReviewQuery {
  page?: number;
  limit?: number;
  blogId?: string;
  userId?: string;
  rating?: number;
  isApproved?: boolean;
  sortBy?: 'createdAt' | 'rating' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface IBlogReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    rating: number;
    count: number;
  }[];
  totalReplies: number;
  // Approval counts removed to match schema
}
