"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogService = exports.BlogService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class BlogService {
    async getAllBlogs(query) {
        const { page = 1, limit = 10, search, categoryId, authorId, isPublished, sortBy = 'createdAt', sortOrder = 'desc' } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { path: '$', string_contains: search } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (authorId) {
            where.authorId = authorId;
        }
        if (typeof isPublished === 'boolean') {
            where.isPublished = isPublished;
        }
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        const [blogs, total] = await Promise.all([
            prisma.blog.findMany({
                where,
                skip,
                take: limit,
                orderBy,
                include: {
                    author: {
                        select: {
                            id: true,
                            fullName: true,
                            email: true,
                        },
                    },
                    category: {
                        select: {
                            id: true,
                            title: true,
                            slug: true,
                        },
                    },
                    blogLikes: {
                        select: {
                            id: true,
                            userId: true,
                        },
                    },
                    reviews: {
                        select: {
                            id: true,
                            rating: true,
                        },
                    },
                },
            }),
            prisma.blog.count({ where }),
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            blogs: blogs,
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
    async getBlogById(id) {
        const blog = await prisma.blog.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
                blogLikes: {
                    select: {
                        id: true,
                        userId: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        commentText: true,
                        fullName: true,
                        createdAt: true,
                    },
                },
            },
        });
        return blog;
    }
    async createBlog(data) {
        let slug = data.slug;
        if (!slug || slug.trim() === '') {
            slug = await this.generateUniqueSlug(data.title);
        }
        else {
            slug = await this.generateUniqueSlug(slug);
        }
        const blog = await prisma.blog.create({
            data: {
                ...data,
                slug,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });
        await this.updateCategoryBlogCount(data.categoryId);
        return blog;
    }
    async updateBlog(id, data) {
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
            select: { categoryId: true, slug: true },
        });
        if (!existingBlog) {
            return null;
        }
        let updateData = { ...data };
        if (data.title && (!data.slug || data.slug.trim() === '')) {
            updateData.slug = await this.generateUniqueSlug(data.title);
        }
        else if (data.slug && data.slug !== existingBlog.slug) {
            updateData.slug = await this.generateUniqueSlug(data.slug);
        }
        const blog = await prisma.blog.update({
            where: { id },
            data: updateData,
            include: {
                author: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        title: true,
                        slug: true,
                    },
                },
            },
        });
        if (data.categoryId && data.categoryId !== existingBlog.categoryId) {
            await Promise.all([
                this.updateCategoryBlogCount(existingBlog.categoryId),
                this.updateCategoryBlogCount(data.categoryId),
            ]);
        }
        return blog;
    }
    async deleteBlog(id) {
        const existingBlog = await prisma.blog.findUnique({
            where: { id },
            select: { categoryId: true },
        });
        if (!existingBlog) {
            return false;
        }
        await prisma.blog.delete({
            where: { id },
        });
        await this.updateCategoryBlogCount(existingBlog.categoryId);
        return true;
    }
    async getBlogsByCategory(categoryId, query) {
        return this.getAllBlogs({ ...query, categoryId });
    }
    async getBlogsByAuthor(authorId, query) {
        return this.getAllBlogs({ ...query, authorId });
    }
    async getBlogStats() {
        const [totalBlogs, publishedBlogs, draftBlogs, totalViews, totalLikes, averageReadingTime, blogsByCategory, blogsByAuthor,] = await Promise.all([
            prisma.blog.count(),
            prisma.blog.count({ where: { isPublished: true } }),
            prisma.blog.count({ where: { isPublished: false } }),
            prisma.blog.aggregate({
                _sum: { viewCount: true },
            }),
            prisma.blog.aggregate({
                _sum: { likes: true },
            }),
            prisma.blog.aggregate({
                _avg: { readingTime: true },
            }),
            prisma.blog.groupBy({
                by: ['categoryId'],
                _count: { id: true },
            }),
            prisma.blog.groupBy({
                by: ['authorId'],
                _count: { id: true },
            }),
        ]);
        return {
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalViews: totalViews._sum.viewCount || 0,
            totalLikes: totalLikes._sum.likes || 0,
            averageReadingTime: averageReadingTime._avg.readingTime || 0,
            blogsByCategory: blogsByCategory.map(item => ({
                categoryId: item.categoryId,
                categoryName: 'Unknown',
                count: item._count.id,
            })),
            blogsByAuthor: blogsByAuthor.map(item => ({
                authorId: item.authorId,
                authorName: 'Unknown',
                count: item._count.id,
            })),
        };
    }
    async incrementViewCount(id) {
        await prisma.blog.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
    }
    async toggleLike(blogId, userId) {
        const existingLike = await prisma.blogLike.findUnique({
            where: {
                blogId_userId: {
                    blogId,
                    userId,
                },
            },
        });
        if (existingLike) {
            await prisma.blogLike.delete({
                where: {
                    blogId_userId: {
                        blogId,
                        userId,
                    },
                },
            });
            await prisma.blog.update({
                where: { id: blogId },
                data: {
                    likes: {
                        decrement: 1,
                    },
                },
            });
            return { liked: false, likes: await this.getBlogLikesCount(blogId) };
        }
        else {
            await prisma.blogLike.create({
                data: {
                    blogId,
                    userId,
                },
            });
            await prisma.blog.update({
                where: { id: blogId },
                data: {
                    likes: {
                        increment: 1,
                    },
                },
            });
            return { liked: true, likes: await this.getBlogLikesCount(blogId) };
        }
    }
    async getBlogLikesCount(blogId) {
        const result = await prisma.blog.findUnique({
            where: { id: blogId },
            select: { likes: true },
        });
        return result?.likes || 0;
    }
    async updateBlogStatus(id, isPublished) {
        const blog = await prisma.blog.update({
            where: { id },
            data: { isPublished },
            include: {
                author: {
                    select: { id: true, fullName: true, email: true },
                },
                category: {
                    select: { id: true, title: true, slug: true },
                },
            },
        });
        return blog;
    }
    async togglePublish(id) {
        const existing = await prisma.blog.findUnique({ where: { id }, select: { isPublished: true } });
        if (!existing) {
            return null;
        }
        const blog = await prisma.blog.update({
            where: { id },
            data: { isPublished: !existing.isPublished },
            include: {
                author: { select: { id: true, fullName: true, email: true } },
                category: { select: { id: true, title: true, slug: true } },
            },
        });
        return blog;
    }
    async updateCategoryBlogCount(categoryId) {
        const count = await prisma.blog.count({
            where: { categoryId },
        });
        await prisma.blogCategory.update({
            where: { id: categoryId },
            data: { blogCount: count },
        });
    }
    generateSlug(title) {
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        return slug || 'untitled-' + Date.now();
    }
    async generateUniqueSlug(baseSlug) {
        const baseSlugGenerated = this.generateSlug(baseSlug);
        let slug = baseSlugGenerated;
        let counter = 1;
        while (true) {
            const existingBlog = await prisma.blog.findUnique({
                where: { slug },
                select: { id: true },
            });
            if (!existingBlog) {
                break;
            }
            slug = `${baseSlugGenerated}-${counter}`;
            counter++;
        }
        return slug;
    }
}
exports.BlogService = BlogService;
exports.blogService = new BlogService();
//# sourceMappingURL=blog.service.js.map