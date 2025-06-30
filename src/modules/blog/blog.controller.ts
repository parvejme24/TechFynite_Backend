import { Request, Response } from 'express';
import { BlogService } from './blog.service';

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogService.getAll();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.getById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const authorId = (req as any).user?.userId;
    const blog = await BlogService.create({ ...req.body, authorId });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const blog = await BlogService.update(req.params.id, req.body);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    await BlogService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

export const likeBlog = async (req: Request, res: Response) => {
  try {
    const blogId = req.params.id;
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const blog = await BlogService.likeBlog(blogId, userId);
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
    const blog = await BlogService.unlikeBlog(blogId, userId);
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to unlike blog' });
  }
}; 