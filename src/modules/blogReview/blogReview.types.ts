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