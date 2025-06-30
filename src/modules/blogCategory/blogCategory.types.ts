export interface CreateBlogCategoryRequest {
  title: string;
  imageUrl?: string;
  slug: string;
}

export interface UpdateBlogCategoryRequest {
  title?: string;
  imageUrl?: string;
  slug?: string;
} 