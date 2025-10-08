import { Blog, BlogCategory, User, BlogLike, BlogReview } from "@prisma/client";
export interface IBlog extends Blog {
    author?: User;
    category?: BlogCategory;
    blogLikes?: BlogLike[];
    reviews?: BlogReview[];
}
export interface ICreateBlog {
    title: string;
    categoryId: string;
    imageUrl?: string;
    description: any;
    readingTime: number;
    authorId: string;
    slug?: string;
    isPublished?: boolean;
    content?: any;
}
export interface IUpdateBlog {
    title?: string;
    categoryId?: string;
    imageUrl?: string;
    description?: any;
    readingTime?: number;
    slug?: string;
    isPublished?: boolean;
    content?: any;
}
export interface IBlogQuery {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    authorId?: string;
    isPublished?: boolean;
    sortBy?: 'createdAt' | 'updatedAt' | 'likes' | 'viewCount' | 'readingTime';
    sortOrder?: 'asc' | 'desc';
}
export interface IBlogResponse {
    success: boolean;
    message: string;
    data?: IBlog | IBlog[] | null;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export interface IBlogStats {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    totalLikes: number;
    averageReadingTime: number;
    blogsByCategory: Array<{
        categoryId: string;
        categoryName: string;
        count: number;
    }>;
    blogsByAuthor: Array<{
        authorId: string;
        authorName: string;
        count: number;
    }>;
}
//# sourceMappingURL=blog.interface.d.ts.map