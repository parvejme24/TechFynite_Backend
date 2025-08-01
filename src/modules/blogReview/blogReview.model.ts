import { prisma } from "../../config/database";
import { BlogReviewInput } from "../blog/blog.types";

export const BlogReviewModel = {
  create: async (data: BlogReviewInput) => {
    // For anonymous reviews, don't include userId in the data
    const createData: any = { ...data };
    if (!createData.userId) {
      delete createData.userId;
    }

    return prisma.blogReview.create({
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

  getByBlogId: async (blogId: string) => {
    return prisma.blogReview.findMany({
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

  getById: async (id: string) => {
    return prisma.blogReview.findUnique({
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

  update: async (
    id: string,
    data: Partial<BlogReviewInput> & { isApproved?: boolean }
  ) => {
    return prisma.blogReview.update({
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

  delete: async (id: string) => {
    return prisma.blogReview.delete({
      where: { id },
    });
  },





  // Get average rating for a blog
  getAverageRating: async (blogId: string) => {
    const result = await prisma.blogReview.aggregate({
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
  getByUserId: async (userId: string) => {
    return prisma.blogReview.findMany({
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
  hasUserReviewed: async (blogId: string, userId: string) => {
    const review = await prisma.blogReview.findFirst({
      where: {
        blogId,
        userId,
      },
    });
    return !!review;
  },

  // Get review statistics
  getReviewStats: async () => {
    const totalReviews = await prisma.blogReview.count();
    const averageRating = await prisma.blogReview.aggregate({
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
  createReply: async (reviewId: string, adminId: string, replyText: string) => {
    return prisma.blogReviewReply.create({
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
  getRepliesByReviewId: async (reviewId: string) => {
    return prisma.blogReviewReply.findMany({
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
  updateReply: async (replyId: string, replyText: string) => {
    return prisma.blogReviewReply.update({
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
  deleteReply: async (replyId: string) => {
    return prisma.blogReviewReply.delete({
      where: { id: replyId },
    });
  },
};
