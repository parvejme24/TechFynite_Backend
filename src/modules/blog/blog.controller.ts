import { Request, Response } from 'express';
import { BlogModel } from './blog.model';
import { BlogContentInput } from './blog.types';

function ensureArray(val: any): string[] {
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      // Try to parse as JSON array
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
      // If not an array, treat as single paragraph
      return [val];
    } catch {
      // If not JSON, treat as single paragraph
      return [val];
    }
  }
  if (val == null) return [];
  return [String(val)];
}

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const includeDrafts = req.query.includeDrafts === 'true';
    const blogs = await BlogModel.getAll(includeDrafts);
    res.json(blogs);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const includeDrafts = req.query.includeDrafts === 'true';
    const blog = await BlogModel.getByIdWithLikeStatus(req.params.id, userId, includeDrafts);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment view count for published blogs
    if (blog.isPublished) {
      await BlogModel.incrementViewCount(req.params.id);
    }

    res.json(blog);
  } catch (error) {
    console.error('Fetch blog by id error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;
    const includeDrafts = req.query.includeDrafts === 'true';
    const blog = await BlogModel.getBySlug(req.params.slug);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user can view draft
    if (!blog.isPublished && !includeDrafts) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Add like status for authenticated users
    if (userId) {
      const hasLiked = await BlogModel.hasUserLiked(blog.id, userId);
      (blog as any).hasLiked = hasLiked;
    }

    // Increment view count for published blogs
    if (blog.isPublished) {
      await BlogModel.incrementViewCount(blog.id);
    }

    res.json(blog);
  } catch (error) {
    console.error('Fetch blog by slug error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    let imageUrl = req.body.imageUrl;
    if (req.files && (req.files as any).image && (req.files as any).image[0]) {
      imageUrl = `/uploads/blogThumbnail/${(req.files as any).image[0].filename}`;
    }

    const { title, categoryId, description, readingTime, content, slug, isPublished } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }
    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }
    if (!readingTime) {
      return res.status(400).json({ error: 'Reading time is required' });
    }
    
    // Handle description as multiple paragraphs
    const parsedDescription: string[] = ensureArray(description);
    
    let parsedContent: BlogContentInput[] = [];
    let contentImages = (req.files as any)?.contentImages || [];
    
    if (content) {
      let rawContent;
      try {
        rawContent = Array.isArray(content) ? content : JSON.parse(content);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid content format. Must be a JSON array.' });
      }
      
      parsedContent = rawContent.map((item: any, idx: number) => ({
        ...item,
        imageUrl: contentImages[idx] ? `/uploads/blogContentImage/${contentImages[idx].filename}` : item.imageUrl,
        description: ensureArray(item.description), // Handle content description as multiple paragraphs
        order: item.order || idx
      }));
    }

    const blog = await BlogModel.create({
      title,
      categoryId,
      imageUrl,
      description: parsedDescription,
      readingTime: Number(readingTime),
      content: parsedContent, // This can be empty array if no content provided
      authorId,
      slug,
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true
    });
    
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ 
      error: 'Failed to create blog', 
      details: error instanceof Error ? error.message : error 
    });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    let imageUrl = req.body.imageUrl;
    if (req.files && (req.files as any).image && (req.files as any).image[0]) {
      imageUrl = `/uploads/blogThumbnail/${(req.files as any).image[0].filename}`;
    }

    const { title, categoryId, description, readingTime, content, slug, isPublished } = req.body;
    
    // Handle description as multiple paragraphs
    const parsedDescription: string[] | undefined = description !== undefined ? ensureArray(description) : undefined;
    
    let parsedContent: BlogContentInput[] | undefined = undefined;
    let contentImages = (req.files as any)?.contentImages || [];
    
    if (content !== undefined) {
      let rawContent;
      try {
        rawContent = Array.isArray(content) ? content : JSON.parse(content);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid content format. Must be a JSON array.' });
      }
      
      parsedContent = rawContent.map((item: any, idx: number) => ({
        ...item,
        imageUrl: contentImages[idx] ? `/uploads/blogContentImage/${contentImages[idx].filename}` : item.imageUrl,
        description: ensureArray(item.description), // Handle content description as multiple paragraphs
        order: item.order || idx
      }));
    }

    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(categoryId !== undefined && { categoryId }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(parsedDescription !== undefined && { description: parsedDescription }),
      ...(readingTime !== undefined && { readingTime: Number(readingTime) }),
      ...(parsedContent !== undefined && { content: parsedContent }),
      ...(slug !== undefined && { slug }),
      ...(isPublished !== undefined && { isPublished: Boolean(isPublished) })
    };

    const blog = await BlogModel.update(req.params.id, updateData);
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      error: 'Failed to update blog', 
      details: error instanceof Error ? error.message : error 
    });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    await BlogModel.delete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

export const likeBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }
    
    const blog = await BlogModel.likeBlog(blogId, userId);
    res.json({
      message: 'Blog liked successfully',
      blog,
      hasLiked: true
    });
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ error: 'Failed to like blog' });
  }
};

export const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }
    
    const blog = await BlogModel.unlikeBlog(blogId, userId);
    res.json({
      message: 'Blog unliked successfully',
      blog,
      hasLiked: false
    });
  } catch (error) {
    console.error('Unlike blog error:', error);
    res.status(500).json({ error: 'Failed to unlike blog' });
  }
};

// Get blogs by category
export const getBlogsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;
    const includeDrafts = req.query.includeDrafts === 'true';
    const blogs = await BlogModel.getAll(includeDrafts);
    const filteredBlogs = blogs.filter(blog => blog.categoryId === categoryId);
    res.json(filteredBlogs);
  } catch (error) {
    console.error('Fetch blogs by category error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs by category' });
  }
};

// Get blogs by author
export const getBlogsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;
    const includeDrafts = req.query.includeDrafts === 'true';
    const blogs = await BlogModel.getAll(includeDrafts);
    const filteredBlogs = blogs.filter(blog => blog.authorId === authorId);
    res.json(filteredBlogs);
  } catch (error) {
    console.error('Fetch blogs by author error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs by author' });
  }
};

// Get popular blogs
export const getPopularBlogs = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const blogs = await BlogModel.getPopularBlogs(limit);
    res.json(blogs);
  } catch (error) {
    console.error('Fetch popular blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch popular blogs' });
  }
};

// Search blogs
export const searchBlogs = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const includeDrafts = req.query.includeDrafts === 'true';
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const blogs = await BlogModel.searchBlogs(q, includeDrafts);
    res.json(blogs);
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({ error: 'Failed to search blogs' });
  }
};

// Toggle blog publish status
export const togglePublishStatus = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    if (!authorId) {
      return res.status(401).json({ error: 'Unauthorized - User not authenticated' });
    }

    const blog = await BlogModel.getById(req.params.id, true);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const newStatus = !blog.isPublished;
    const updatedBlog = await BlogModel.update(req.params.id, { isPublished: newStatus });
    
    res.json({
      message: `Blog ${newStatus ? 'published' : 'unpublished'} successfully`,
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Toggle publish status error:', error);
    res.status(500).json({ error: 'Failed to toggle publish status' });
  }
};
