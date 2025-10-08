"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogReviewService = exports.BlogReviewService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BlogReviewService {
    async createBlogReview(data) {
        const blogExists = await prisma.blog.findUnique({ where: { id: data.blogId } });
        if (!blogExists) {
            throw new Error("Blog not found for the provided blogId");
        }
        const createData = {
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
        return review;
    }
    async createBlogReviewReply(data) {
        const createData = {
            replyText: data.replyText,
            review: { connect: { id: data.reviewId } },
        };
        createData.admin = { connect: { id: data.adminId } };
        const reply = await prisma.blogReviewReply.create({ data: createData });
        return reply;
    }
    async getBlogReviews(query) {
        const { page = 1, limit = 10, blogId, userId, rating, isApproved, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (blogId) {
            where.blogId = blogId;
        }
        if (userId) {
            where.userId = userId;
        }
        if (rating) {
            where.rating = rating;
        }
        if (typeof isApproved === 'boolean') {
            where.isApproved = isApproved;
        }
        const orderBy = {};
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
            reviews: reviews,
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
    async getBlogReviewById(id) {
        const review = await prisma.blogReview.findUnique({
            where: { id },
            include: { replies: true },
        });
        return review;
    }
    async getReviewsByBlogId(blogId, query) {
        return this.getBlogReviews({ ...query, blogId });
    }
    async deleteBlogReview(id) {
        try {
            await prisma.blogReviewReply.deleteMany({
                where: { reviewId: id },
            });
            await prisma.blogReview.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            console.error("Error deleting blog review:", error);
            return false;
        }
    }
    async deleteBlogReviewReply(id) {
        try {
            await prisma.blogReviewReply.delete({
                where: { id },
            });
            return true;
        }
        catch (error) {
            console.error("Error deleting blog review reply:", error);
            return false;
        }
    }
    async getBlogReviewStats(blogId) {
        const where = blogId ? { blogId } : {};
        const [totalReviews, approvedReviews, pendingReviews, averageRating, ratingDistribution, totalReplies,] = await Promise.all([
            prisma.blogReview.count({ where }),
            prisma.blogReview.count({ where }),
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
            averageRating: averageRating._avg?.rating || 0,
            ratingDistribution: ratingDistribution.map(item => ({
                rating: item.rating,
                count: item._count.id,
            })),
            totalReplies,
        };
    }
    async hasUserReviewed(blogId, userId) {
        const existingReview = await prisma.blogReview.findFirst({
            where: {
                blogId,
                userId,
            },
        });
        return !!existingReview;
    }
}
exports.BlogReviewService = BlogReviewService;
exports.blogReviewService = new BlogReviewService();
//# sourceMappingURL=blog-review.service.js.map