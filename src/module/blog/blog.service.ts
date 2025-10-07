import { PrismaClient } from "@prisma/client";
import { IBlog, ICreateBlog, IUpdateBlog, IBlogQuery, IBlogStats } from "./blog.interface";

const prisma = new PrismaClient();

export class BlogService {
  // Get all blogs with pagination and filtering
  public async getAllBlogs(query: IBlogQuery): Promise<{
    blogs: IBlog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    const { page = 1, limit = 10, search, categoryId, authorId, isPublished, sortBy = 'createdAt', sortOrder = 'desc' } = query;
    
    const skip = (page - 1) * limit;
    
    // Build where clause
    const where: any = {};
    
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
    
    // Build orderBy clause
    const orderBy: any = {};
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
      blogs: blogs as IBlog[],
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
  
  // Get blog by ID
  public async getBlogById(id: string): Promise<IBlog | null> {
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
    
    return blog as IBlog | null;
  }
  
  // Create new blog
  public async createBlog(data: ICreateBlog): Promise<IBlog> {
    // Generate slug if not provided
    let slug = data.slug;
    if (!slug || slug.trim() === '') {
      slug = this.generateSlug(data.title);
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
    
    // Update category blog count
    await this.updateCategoryBlogCount(data.categoryId);
    
    return blog as IBlog;
  }
  
  // Update blog
  public async updateBlog(id: string, data: IUpdateBlog): Promise<IBlog | null> {
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
      select: { categoryId: true },
    });
    
    if (!existingBlog) {
      return null;
    }
    
    // Generate slug if title is provided but slug is not
    let updateData = { ...data };
    if (data.title && (!data.slug || data.slug.trim() === '')) {
      updateData.slug = this.generateSlug(data.title);
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
    
    // Update category blog count if category changed
    if (data.categoryId && data.categoryId !== existingBlog.categoryId) {
      await Promise.all([
        this.updateCategoryBlogCount(existingBlog.categoryId),
        this.updateCategoryBlogCount(data.categoryId),
      ]);
    }
    
    return blog as IBlog;
  }
  
  // Delete blog
  public async deleteBlog(id: string): Promise<boolean> {
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
    
    // Update category blog count
    await this.updateCategoryBlogCount(existingBlog.categoryId);
    
    return true;
  }
  
  // Get blogs by category
  public async getBlogsByCategory(categoryId: string, query: IBlogQuery): Promise<{
    blogs: IBlog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getAllBlogs({ ...query, categoryId });
  }
  
  // Get blogs by author
  public async getBlogsByAuthor(authorId: string, query: IBlogQuery): Promise<{
    blogs: IBlog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    return this.getAllBlogs({ ...query, authorId });
  }
  
  // Get blog statistics
  public async getBlogStats(): Promise<IBlogStats> {
    const [
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalViews,
      totalLikes,
      averageReadingTime,
      blogsByCategory,
      blogsByAuthor,
    ] = await Promise.all([
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
        categoryName: 'Unknown', // Will be populated separately if needed
        count: item._count.id,
      })),
      blogsByAuthor: blogsByAuthor.map(item => ({
        authorId: item.authorId,
        authorName: 'Unknown', // Will be populated separately if needed
        count: item._count.id,
      })),
    };
  }
  
  // Increment view count
  public async incrementViewCount(id: string): Promise<void> {
    await prisma.blog.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
  
  // Toggle like
  public async toggleLike(blogId: string, userId: string): Promise<{ liked: boolean; likes: number }> {
    const existingLike = await prisma.blogLike.findUnique({
      where: {
        blogId_userId: {
          blogId,
          userId,
        },
      },
    });
    
    if (existingLike) {
      // Unlike
      await prisma.blogLike.delete({
        where: {
          blogId_userId: {
            blogId,
            userId,
          },
        },
      });
      
      // Decrement likes count
      await prisma.blog.update({
        where: { id: blogId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      
      return { liked: false, likes: await this.getBlogLikesCount(blogId) };
    } else {
      // Like
      await prisma.blogLike.create({
        data: {
          blogId,
          userId,
        },
      });
      
      // Increment likes count
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
  
  // Get blog likes count
  private async getBlogLikesCount(blogId: string): Promise<number> {
    const result = await prisma.blog.findUnique({
      where: { id: blogId },
      select: { likes: true },
    });
    
    return result?.likes || 0;
  }
  
  // Update blog publish status
  public async updateBlogStatus(id: string, isPublished: boolean): Promise<IBlog | null> {
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
    return blog as IBlog;
  }

  // Toggle blog publish status
  public async togglePublish(id: string): Promise<IBlog | null> {
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
    return blog as IBlog;
  }

  // Update category blog count
  private async updateCategoryBlogCount(categoryId: string): Promise<void> {
    const count = await prisma.blog.count({
      where: { categoryId },
    });
    
    await prisma.blogCategory.update({
      where: { id: categoryId },
      data: { blogCount: count },
    });
  }
  
  // Generate slug from title
  private generateSlug(title: string): string {
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    
    // Ensure we have a valid slug
    return slug || 'untitled-' + Date.now();
  }
}

export const blogService = new BlogService();
