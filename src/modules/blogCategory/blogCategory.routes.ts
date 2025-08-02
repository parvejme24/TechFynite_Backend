import { Router } from "express";
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "./blogCategory.controller";
import { uploadCategoryImageCloudinary } from '../../middlewares/cloudinary-upload';

const router = Router();

router.get("/blog-categories", getAllBlogCategories);
router.get("/blog-categories/:id", getBlogCategoryById);
router.post("/blog-categories", uploadCategoryImageCloudinary, createBlogCategory);
router.put("/blog-categories/:id", uploadCategoryImageCloudinary, updateBlogCategory);
router.delete("/blog-categories/:id", deleteBlogCategory);

export default router;
