import { Router } from "express";
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "./blogCategory.controller";
import { uploadBlogCategoryImage } from '../../middlewares/upload';

const router = Router();

router.get("/blog-categories", getAllBlogCategories);
router.get("/blog-categories/:id", getBlogCategoryById);
router.post("/blog-categories", uploadBlogCategoryImage.single('image'), createBlogCategory);
router.put("/blog-categories/:id", uploadBlogCategoryImage.single('image'), updateBlogCategory);
router.delete("/blog-categories/:id", deleteBlogCategory);

export default router;
