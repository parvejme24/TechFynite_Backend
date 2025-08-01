"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = void 0;
const database_1 = require("../../config/database");
// Generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}
exports.BlogModel = {
    getAll: async (includeDrafts = false) => {
        return database_1.prisma.blog.findMany({
            where: includeDrafts ? {} : { isPublished: true },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                },
                content: {
                    orderBy: { order: 'asc' }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                },
                _count: {
                    select: {
                        content: true,
                        reviews: true,
                        blogLikes: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    },
    getById: async (id, includeDrafts = false) => {
        return database_1.prisma.blog.findUnique({
            where: {
                id,
                ...(includeDrafts ? {} : { isPublished: true })
            },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                content: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    getBySlug: async (slug, includeDrafts = false) => {
        return database_1.prisma.blog.findUnique({
            where: {
                slug,
                ...(includeDrafts ? {} : { isPublished: true })
            },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                content: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    create: async (data) => {
        const { content, ...rest } = data;
        // Generate slug if not provided
        const slug = rest.slug || generateSlug(rest.title);
        // Check if slug already exists
        const existingSlug = await database_1.prisma.blog.findUnique({ where: { slug } });
        if (existingSlug) {
            // Add timestamp to make slug unique
            const timestamp = Date.now();
            rest.slug = `${slug}-${timestamp}`;
        }
        else {
            rest.slug = slug;
        }
        return database_1.prisma.blog.create({
            data: {
                ...rest,
                ...(content && content.length > 0 ? {
                    content: {
                        create: content.map((item, index) => ({
                            ...item,
                            order: item.order || index
                        }))
                    }
                } : {}),
            },
            include: {
                category: true,
                reviews: true,
                content: {
                    orderBy: { order: 'asc' }
                },
                blogLikes: true,
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    update: async (id, data) => {
        const { content, categoryId, ...rest } = data;
        // Generate slug if title is being updated and slug is not provided
        if (rest.title && !rest.slug) {
            const slug = generateSlug(rest.title);
            const existingSlug = await database_1.prisma.blog.findUnique({
                where: {
                    slug,
                    NOT: { id }
                }
            });
            if (existingSlug) {
                const timestamp = Date.now();
                rest.slug = `${slug}-${timestamp}`;
            }
            else {
                rest.slug = slug;
            }
        }
        const updateData = {
            ...rest,
            ...(categoryId !== undefined ? { categoryId } : {}),
        };
        if (content) {
            updateData.content = {
                deleteMany: {},
                create: content.map((item, index) => ({
                    ...item,
                    order: item.order || index
                })),
            };
        }
        return database_1.prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                },
                content: {
                    orderBy: { order: 'asc' }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    delete: async (id) => {
        // Delete related content and likes first (cascade will handle this, but being explicit)
        await database_1.prisma.blogContent.deleteMany({
            where: { blogId: id }
        });
        await database_1.prisma.blogLike.deleteMany({
            where: { blogId: id }
        });
        await database_1.prisma.blogReview.deleteMany({
            where: { blogId: id }
        });
        return database_1.prisma.blog.delete({ where: { id } });
    },
    incrementViewCount: async (id) => {
        return database_1.prisma.blog.update({
            where: { id },
            data: { viewCount: { increment: 1 } }
        });
    },
    likeBlog: async (blogId, userId) => {
        const existing = await database_1.prisma.blogLike.findUnique({
            where: { blogId_userId: { blogId, userId } }
        });
        if (!existing) {
            await database_1.prisma.blogLike.create({ data: { blogId, userId } });
            await database_1.prisma.blog.update({
                where: { id: blogId },
                data: { likes: { increment: 1 } }
            });
        }
        return database_1.prisma.blog.findUnique({
            where: { id: blogId },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                },
                content: {
                    orderBy: { order: 'asc' }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    unlikeBlog: async (blogId, userId) => {
        const existing = await database_1.prisma.blogLike.findUnique({
            where: { blogId_userId: { blogId, userId } }
        });
        if (existing) {
            await database_1.prisma.blogLike.delete({
                where: { blogId_userId: { blogId, userId } }
            });
            await database_1.prisma.blog.update({
                where: { id: blogId },
                data: { likes: { decrement: 1 } }
            });
        }
        return database_1.prisma.blog.findUnique({
            where: { id: blogId },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    }
                },
                content: {
                    orderBy: { order: 'asc' }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
    },
    // Check if user has liked the blog
    hasUserLiked: async (blogId, userId) => {
        const like = await database_1.prisma.blogLike.findUnique({
            where: { blogId_userId: { blogId, userId } }
        });
        return !!like;
    },
    // Get blog with like status for a specific user
    getByIdWithLikeStatus: async (id, userId, includeDrafts = false) => {
        const blog = await database_1.prisma.blog.findUnique({
            where: {
                id,
                ...(includeDrafts ? {} : { isPublished: true })
            },
            include: {
                category: true,
                reviews: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        },
                        replies: {
                            include: {
                                admin: {
                                    select: {
                                        id: true,
                                        displayName: true,
                                        email: true,
                                        photoUrl: true,
                                    }
                                }
                            },
                            orderBy: {
                                createdAt: 'asc'
                            }
                        }
                    },
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
                content: {
                    orderBy: {
                        order: 'asc'
                    }
                },
                blogLikes: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                displayName: true,
                                email: true,
                                photoUrl: true,
                            }
                        }
                    }
                },
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                }
            },
        });
        if (blog && userId) {
            const hasLiked = await exports.BlogModel.hasUserLiked(id, userId);
            return { ...blog, hasLiked };
        }
        return blog;
    },
    // Get popular blogs (by views or likes)
    getPopularBlogs: async (limit = 10) => {
        return database_1.prisma.blog.findMany({
            where: { isPublished: true },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                },
                _count: {
                    select: {
                        content: true,
                        reviews: true,
                        blogLikes: true,
                    }
                }
            },
            orderBy: [
                { viewCount: 'desc' },
                { likes: 'desc' }
            ],
            take: limit
        });
    },
    // Search blogs
    searchBlogs: async (query, includeDrafts = false) => {
        return database_1.prisma.blog.findMany({
            where: {
                ...(includeDrafts ? {} : { isPublished: true }),
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { hasSome: [query] } },
                    { slug: { contains: query, mode: 'insensitive' } }
                ]
            },
            include: {
                category: true,
                author: {
                    select: {
                        id: true,
                        displayName: true,
                        email: true,
                        photoUrl: true,
                    }
                },
                _count: {
                    select: {
                        content: true,
                        reviews: true,
                        blogLikes: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }
};
