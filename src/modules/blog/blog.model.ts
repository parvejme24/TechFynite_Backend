import { prisma } from '../../config/database';
import { CreateBlogRequest, UpdateBlogRequest } from './blog.types';

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export const BlogModel = {
  getAll: async (includeDrafts: boolean = false) => {
    return prisma.blog.findMany({
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

  getById: async (id: string, includeDrafts: boolean = false) => {
    return prisma.blog.findUnique({
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

  getBySlug: async (slug: string, includeDrafts: boolean = false) => {
    return prisma.blog.findUnique({
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

  create: async (data: CreateBlogRequest) => {
    const { content, ...rest } = data;
    
    // Generate slug if not provided
    const slug = rest.slug || generateSlug(rest.title);
    
    // Check if slug already exists
    const existingSlug = await prisma.blog.findUnique({ where: { slug } });
    if (existingSlug) {
      // Add timestamp to make slug unique
      const timestamp = Date.now();
      rest.slug = `${slug}-${timestamp}`;
    } else {
      rest.slug = slug;
    }

    return prisma.blog.create({
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

  update: async (id: string, data: UpdateBlogRequest) => {
    const { content, categoryId, ...rest } = data;
    
    // Generate slug if title is being updated and slug is not provided
    if (rest.title && !rest.slug) {
      const slug = generateSlug(rest.title);
      const existingSlug = await prisma.blog.findUnique({ 
        where: { 
          slug,
          NOT: { id }
        } 
      });
      if (existingSlug) {
        const timestamp = Date.now();
        rest.slug = `${slug}-${timestamp}`;
      } else {
        rest.slug = slug;
      }
    }
    
    const updateData: any = {
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
    
    return prisma.blog.update({
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

  delete: async (id: string) => {
    // Delete related content and likes first (cascade will handle this, but being explicit)
    await prisma.blogContent.deleteMany({
      where: { blogId: id }
    });
    
    await prisma.blogLike.deleteMany({
      where: { blogId: id }
    });
    
    await prisma.blogReview.deleteMany({
      where: { blogId: id }
    });
    
    return prisma.blog.delete({ where: { id } });
  },

  incrementViewCount: async (id: string) => {
    return prisma.blog.update({
      where: { id },
      data: { viewCount: { increment: 1 } }
    });
  },

  likeBlog: async (blogId: string, userId: string) => {
    const existing = await prisma.blogLike.findUnique({ 
      where: { blogId_userId: { blogId, userId } } 
    });
    
    if (!existing) {
      await prisma.blogLike.create({ data: { blogId, userId } });
      await prisma.blog.update({ 
        where: { id: blogId }, 
        data: { likes: { increment: 1 } } 
      });
    }
    
    return prisma.blog.findUnique({
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

  unlikeBlog: async (blogId: string, userId: string) => {
    const existing = await prisma.blogLike.findUnique({ 
      where: { blogId_userId: { blogId, userId } } 
    });
    
    if (existing) {
      await prisma.blogLike.delete({ 
        where: { blogId_userId: { blogId, userId } } 
      });
      await prisma.blog.update({ 
        where: { id: blogId }, 
        data: { likes: { decrement: 1 } } 
      });
    }
    
    return prisma.blog.findUnique({
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
  hasUserLiked: async (blogId: string, userId: string) => {
    const like = await prisma.blogLike.findUnique({
      where: { blogId_userId: { blogId, userId } }
    });
    return !!like;
  },

  // Get blog with like status for a specific user
  getByIdWithLikeStatus: async (id: string, userId?: string, includeDrafts: boolean = false) => {
    const blog = await prisma.blog.findUnique({
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
      const hasLiked = await BlogModel.hasUserLiked(id, userId);
      return { ...blog, hasLiked };
    }

    return blog;
  },

  // Get popular blogs (by views or likes)
  getPopularBlogs: async (limit: number = 10) => {
    return prisma.blog.findMany({
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
  searchBlogs: async (query: string, includeDrafts: boolean = false) => {
    return prisma.blog.findMany({
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
