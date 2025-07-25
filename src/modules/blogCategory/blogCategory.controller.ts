import { Request, Response } from "express";
import { BlogCategoryService } from "./blogCategory.service";

export const getAllBlogCategories = async (req: Request, res: Response) => {
  try {
    const categories = await BlogCategoryService.getAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog categories" });
  }
};

export const getBlogCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await BlogCategoryService.getById(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Blog category not found" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blog category" });
  }
};

export const createBlogCategory = async (req: Request, res: Response) => {
  try {
    const { title, slug } = req.body;
    let imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    const category = await BlogCategoryService.create({
      title,
      slug,
      imageUrl,
    });
    res.status(201).json(category);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to create blog category",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const updateBlogCategory = async (req: Request, res: Response) => {
  try {
    const { title, slug } = req.body;
    let imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : req.body.imageUrl;
    const category = await BlogCategoryService.update(req.params.id, {
      title,
      slug,
      imageUrl,
    });
    res.json(category);
  } catch (error) {
    res
      .status(500)
      .json({
        error: "Failed to update blog category",
        details: error instanceof Error ? error.message : error,
      });
  }
};

export const deleteBlogCategory = async (req: Request, res: Response) => {
  try {
    await BlogCategoryService.delete(req.params.id);
    res.status(204).send({ message: "Blog category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete blog category" });
  }
};
