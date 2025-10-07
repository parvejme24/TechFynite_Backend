import { BlogCategory, PaginatedResult } from "./blog-category.type";

export interface IBlogCategoryService {
  getAllBlogCategories(
    page?: number,
    limit?: number,
    search?: string
  ): Promise<PaginatedResult<BlogCategory>>;

  getBlogCategoryById(id: string): Promise<BlogCategory | null>;

  createBlogCategory(
    data: { title: string; slug?: string | null },
    imageUrl?: string
  ): Promise<BlogCategory>;

  updateBlogCategory(
    id: string,
    data: { title?: string; slug?: string | null },
    imageUrl?: string
  ): Promise<BlogCategory>;

  deleteBlogCategory(id: string): Promise<void>;
}
