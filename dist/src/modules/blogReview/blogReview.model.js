"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogReviewModel = void 0;
const database_1 = require("../../config/database");
exports.BlogReviewModel = {
    create: async (data) => {
        // For anonymous reviews, don't include userId in the data
        const createData = { ...data };
        if (!createData.userId) {
            delete createData.userId;
        }
        return database_1.prisma.blogReview.create({
            data: createData,
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
                blog: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                replies: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
    },
    getByBlogId: async (blogId) => {
        return database_1.prisma.blogReview.findMany({
            where: {
                blogId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
                replies: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    getById: async (id) => {
        return database_1.prisma.blogReview.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
                blog: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                replies: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
    },
    update: async (id, data) => {
        return database_1.prisma.blogReview.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
                blog: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                replies: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
        });
    },
    delete: async (id) => {
        return database_1.prisma.blogReview.delete({
            where: { id },
        });
    },
    // Get average rating for a blog
    getAverageRating: async (blogId) => {
        const result = await database_1.prisma.blogReview.aggregate({
            where: {
                blogId,
                rating: { not: null },
            },
            _avg: {
                rating: true,
            },
            _count: {
                rating: true,
            },
        });
        return {
            averageRating: result._avg.rating || 0,
            totalRatings: result._count.rating || 0,
        };
    },
    // Get reviews by user
    getByUserId: async (userId) => {
        return database_1.prisma.blogReview.findMany({
            where: { userId },
            include: {
                blog: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                        imageUrl: true,
                    },
                },
                replies: {
                    include: {
                        admin: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            },
                        },
                    },
                    orderBy: {
                        createdAt: 'asc',
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },
    // Check if user has already reviewed a blog
    hasUserReviewed: async (blogId, userId) => {
        const review = await database_1.prisma.blogReview.findFirst({
            where: {
                blogId,
                userId,
            },
        });
        return !!review;
    },
    // Get review statistics
    getReviewStats: async () => {
        const totalReviews = await database_1.prisma.blogReview.count();
        const averageRating = await database_1.prisma.blogReview.aggregate({
            where: {
                rating: { not: null },
            },
            _avg: {
                rating: true,
            },
        });
        return {
            totalReviews,
            averageRating: averageRating._avg.rating || 0,
        };
    },
    // Create a reply to a review
    createReply: async (reviewId, adminId, replyText) => {
        return database_1.prisma.blogReviewReply.create({
            data: {
                reviewId,
                adminId,
                replyText,
            },
            include: {
                admin: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
            },
        });
    },
    // Get replies for a review
    getRepliesByReviewId: async (reviewId) => {
        return database_1.prisma.blogReviewReply.findMany({
            where: { reviewId },
            include: {
                admin: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
    },
    // Update a reply
    updateReply: async (replyId, replyText) => {
        return database_1.prisma.blogReviewReply.update({
            where: { id: replyId },
            data: { replyText },
            include: {
                admin: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    },
                },
            },
        });
    },
    // Delete a reply
    deleteReply: async (replyId) => {
        return database_1.prisma.blogReviewReply.delete({
            where: { id: replyId },
        });
    },
};
