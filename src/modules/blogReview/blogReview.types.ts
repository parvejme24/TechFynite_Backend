export interface CreateBlogReviewRequest {
  blogId: string;
  userName: string;
  photoUrl?: string;
  commentText: string;
  reply?: any;
}

export interface UpdateBlogReviewRequest {
  commentText?: string;
  reply?: any;
} 