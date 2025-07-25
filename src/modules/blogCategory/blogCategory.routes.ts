import { Router } from "express";
import {
  getAllBlogCategories,
  getBlogCategoryById,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "./blogCategory.controller";
import { upload } from '../../middlewares/upload';

const router = Router();

router.get("/blog-categories", getAllBlogCategories);
router.get("/blog-categories/:id", getBlogCategoryById);
router.post("/blog-categories", upload.single('image'), createBlogCategory);
router.put("/blog-categories/:id", upload.single('image'), updateBlogCategory);
router.delete("/blog-categories/:id", deleteBlogCategory);

export default router;
