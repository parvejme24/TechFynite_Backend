export interface BlogContentInput {
  heading: string;
  description: string[]; // Multiple paragraphs for content description
  imageUrl?: string;
  order?: number; // For ordering content sections
}

export interface CreateBlogRequest {
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string[]; // Multiple paragraphs for blog description
  readingTime: number;
  content?: BlogContentInput[]; // Array of content sections (optional)
  authorId: string;
  slug?: string; // SEO-friendly URL
  isPublished?: boolean; // Draft/Published status
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: string;
  imageUrl?: string;
  description?: string[]; // Multiple paragraphs for blog description
  readingTime?: number;
  content?: BlogContentInput[]; // Array of content sections
  slug?: string; // SEO-friendly URL
  isPublished?: boolean; // Draft/Published status
}

export interface BlogReviewInput {
  blogId: string;
  userId?: string; // Optional for anonymous reviews
  fullName: string;
  email: string;
  photoUrl?: string;
  commentText: string;
  rating?: number; // Optional rating (1-5)
}

export interface BlogReviewReplyInput {
  reviewId: string;
  adminId: string;
  replyText: string;
}

export interface BlogResponse {
  id: string;
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string[];
  likes: number;
  readingTime: number;
  authorId: string;
  slug?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
  };
  content: Array<{
    id: string;
    heading: string;
    description: string[];
    imageUrl?: string;
    order: number;
    createdAt: Date;
  }>;
  reviews: Array<{
    id: string;
    blogId: string;
    userId?: string;
    fullName: string;
    email: string;
    photoUrl?: string;
    commentText: string;
    rating?: number;
    replies?: Array<{
      id: string;
      replyText: string;
      createdAt: Date;
      admin: {
        id: string;
        displayName: string;
        email: string;
        photoUrl?: string;
      };
    }>;
    createdAt: Date;
    updatedAt: Date;
    user?: {
      id: string;
      displayName: string;
      email: string;
      photoUrl?: string;
    };
  }>;
  blogLikes: Array<{
    id: string;
    blogId: string;
    userId: string;
    createdAt: Date;
    user: {
      id: string;
      displayName: string;
      email: string;
      photoUrl?: string;
    };
  }>;
  author: {
    id: string;
    displayName: string;
    email: string;
    photoUrl?: string;
  };
  hasLiked?: boolean; // For authenticated users
}

export interface BlogListResponse {
  id: string;
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string[];
  likes: number;
  readingTime: number;
  authorId: string;
  slug?: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    title: string;
    slug: string;
    imageUrl?: string;
  };
  author: {
    id: string;
    displayName: string;
    email: string;
    photoUrl?: string;
  };
  _count: {
    content: number;
    reviews: number;
    blogLikes: number;
  };
} 