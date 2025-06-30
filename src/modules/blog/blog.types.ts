export interface CreateBlogRequest {
  title: string;
  categoryId: string;
  imageUrl?: string;
  description: string;
  readingTime: number;
  content: any[];
}

export interface UpdateBlogRequest {
  title?: string;
  categoryId?: string;
  imageUrl?: string;
  description?: string;
  readingTime?: number;
  content?: any[];
} 