export interface BlogContentInput {
  heading: string;
  description: string[];
  imageUrl?: string;
}

export interface CreateBlogRequest {
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string[];
  readingTime: number;
  content: BlogContentInput[];
  authorId: string;
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: string;
  imageUrl?: string;
  description?: string[];
  readingTime?: number;
  content?: BlogContentInput[];
} 