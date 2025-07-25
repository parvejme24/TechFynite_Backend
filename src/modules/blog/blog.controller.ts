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
    const blogs = await BlogModel.getAll();
    res.json(blogs);
  } catch (error) {
    console.error('Fetch blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await BlogModel.getById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    console.error('Fetch blog by id error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    let imageUrl = req.files && (req.files as any).image
      ? `/uploads/${(req.files as any).image[0].filename}`
      : req.body.imageUrl;
    const { title, categoryId, description, readingTime, content } = req.body;
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
        imageUrl: contentImages[idx] ? `/uploads/${contentImages[idx].filename}` : item.imageUrl,
        description: ensureArray(item.description)
      }));
    }
    const blog = await BlogModel.create({
      title,
      categoryId,
      imageUrl,
      description: parsedDescription,
      readingTime: Number(readingTime),
      content: parsedContent,
      authorId,
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog', details: error instanceof Error ? error.message : error });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    let imageUrl = req.files && (req.files as any).image
      ? `/uploads/${(req.files as any).image[0].filename}`
      : req.body.imageUrl;
    const { title, categoryId, description, readingTime, content } = req.body;
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
        imageUrl: contentImages[idx] ? `/uploads/${contentImages[idx].filename}` : item.imageUrl,
        description: ensureArray(item.description)
      }));
    }
    const updateData: any = {
      ...(title !== undefined && { title }),
      ...(categoryId !== undefined && { categoryId }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(parsedDescription !== undefined && { description: parsedDescription }),
      ...(readingTime !== undefined && { readingTime: Number(readingTime) }),
      ...(parsedContent !== undefined && { content: parsedContent }),
    };
    const blog = await BlogModel.update(req.params.id, updateData);
    res.json(blog);
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog', details: error instanceof Error ? error.message : error });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await BlogModel.delete(req.params.id);
    res.status(204).send({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

export const likeBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const blog = await BlogModel.likeBlog(blogId, userId);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to like blog' });
  }
};

export const unlikeBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const blog = await BlogModel.unlikeBlog(blogId, userId);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike blog' });
  }
};
