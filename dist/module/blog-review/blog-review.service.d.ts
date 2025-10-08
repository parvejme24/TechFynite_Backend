import { IBlogReview, ICreateBlogReview, ICreateBlogReviewReply, IBlogReviewQuery, IBlogReviewStats } from "./blog-review.interface";
export declare class BlogReviewService {
    createBlogReview(data: ICreateBlogReview): Promise<IBlogReview>;
    createBlogReviewReply(data: ICreateBlogReviewReply): Promise<any>;
    getBlogReviews(query: IBlogReviewQuery): Promise<{
        reviews: IBlogReview[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    getBlogReviewById(id: string): Promise<IBlogReview | null>;
    getReviewsByBlogId(blogId: string, query: IBlogReviewQuery): Promise<{
        reviews: IBlogReview[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
            hasNext: boolean;
            hasPrev: boolean;
        };
    }>;
    deleteBlogReview(id: string): Promise<boolean>;
    deleteBlogReviewReply(id: string): Promise<boolean>;
    getBlogReviewStats(blogId?: string): Promise<IBlogReviewStats>;
    hasUserReviewed(blogId: string, userId: string): Promise<boolean>;
}
export declare const blogReviewService: BlogReviewService;
//# sourceMappingURL=blog-review.service.d.ts.map