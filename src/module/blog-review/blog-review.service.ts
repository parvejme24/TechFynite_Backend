import { PrismaClient } from "@prisma/client";
import { IBlogReview, ICreateBlogReview, ICreateBlogReviewReply, IBlogReviewQuery, IBlogReviewStats } from "./blog-review.interface";

const prisma = new PrismaClient();

export class BlogReviewService {
  // Create blog review
  public async createBlogReview(data: ICreateBlogReview): Promise<IBlogReview> {
    // Ensure blog exists to avoid FK violation
    const blogExists = await prisma.blog.findUnique({ where: { id: data.blogId } });
    if (!blogExists) {
      throw new Error("Blog not found for the provided blogId");
    }

    const createData: any = {
      commentText: data.commentText,
      fullName: data.fullName,
      email: data.email,
      rating: data.rating ?? null,
      photoUrl: data.photoUrl ?? null,
      blog: { connect: { id: data.blogId } },
    };
    if (data.userId) {
      createData.user = { connect: { id: data.userId } };
    }
    const review = await prisma.blogReview.create({
      data: createData,
      include: { replies: true },
    });

    return review as IBlogReview;
  }

  // Create blog review reply
  public async createBlogReviewReply(data: ICreateBlogReviewReply): Promise<any> {
    const createData: any = {
      replyText: data.replyText,
      review: { connect: { id: data.reviewId } },
    };
    // Connect required admin relation from controller-provided adminId
    createData.admin = { connect: { id: (data as any).adminId } };
    const reply = await prisma.blogReviewReply.create({ data: createData });

    return reply as any;
  }

  // Get blog reviews with pagination and filtering
  public async getBlogReviews(query: IBlogReviewQuery): Promise<{
    reviews: IBlogReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { page = 1, limit = 10, blogId, userId, rating, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
    if (blogId) {
      where.blogId = blogId;
    }
    
    if (userId) {
      where.userId = userId;
    }
    
    if (rating) {
      where.rating = rating;
    }
    
    // Build orderBy clause
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;
    
    const [reviews, total] = await Promise.all([
      prisma.blogReview.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: { replies: true },
      }),
      prisma.blogReview.count({ where }),
    ]);
    
    const totalPages = Math.ceil(total / limit);
    
    return {
      reviews: reviews as IBlogReview[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  // Get blog review by ID
  public async getBlogReviewById(id: string): Promise<IBlogReview | null> {
    const review = await prisma.blogReview.findUnique({
      where: { id },
        include: { replies: true },
    });

    return review as IBlogReview | null;
  }

  // Get reviews by blog ID
  public async getReviewsByBlogId(blogId: string, query: IBlogReviewQuery): Promise<{
    reviews: IBlogReview[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getBlogReviews({ ...query, blogId });
  }

  // Update review approval status
  // Approval update removed to match Prisma model

  // Delete blog review
  public async deleteBlogReview(id: string): Promise<boolean> {
    try {
      // Delete all replies first
      await prisma.blogReviewReply.deleteMany({
        where: { reviewId: id },
      });

      // Delete the review
      await prisma.blogReview.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting blog review:", error);
      return false;
    }
  }

  // Delete blog review reply
  public async deleteBlogReviewReply(id: string): Promise<boolean> {
    try {
      await prisma.blogReviewReply.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error("Error deleting blog review reply:", error);
      return false;
    }
  }

  // Get blog review statistics
  public async getBlogReviewStats(blogId?: string): Promise<IBlogReviewStats> {
    const where = blogId ? { blogId } : {};

    const [
      totalReviews,
      averageRating,
      ratingDistribution,
      totalReplies,
    ] = await Promise.all([
      prisma.blogReview.count({ where }),
      prisma.blogReview.aggregate({
        where,
        _avg: { rating: true },
      }),
      prisma.blogReview.groupBy({
        by: ['rating'],
        where,
        _count: { id: true },
      }),
      prisma.blogReviewReply.count({
        where: blogId ? { review: { blogId } } : {},
      }),
    ]);

    return {
      totalReviews,
      averageRating: (averageRating._avg?.rating as number) || 0,
      ratingDistribution: ratingDistribution.map(item => ({
        rating: item.rating as number,
        count: (item._count as any).id as number,
      })),
      totalReplies,
    };
  }

  // Check if user has already reviewed the blog
  public async hasUserReviewed(blogId: string, userId: string): Promise<boolean> {
    const existingReview = await prisma.blogReview.findFirst({
      where: {
        blogId,
        userId,
      },
    });

    return !!existingReview;
  }
}

export const blogReviewService = new BlogReviewService();
