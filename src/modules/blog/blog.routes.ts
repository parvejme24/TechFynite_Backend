import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
} from "./blog.controller";
import { authMiddleware, adminOrSuperAdminOnly } from "../../middlewares/auth";

const router = Router();

router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.post("/blogs", authMiddleware, adminOrSuperAdminOnly, createBlog);
router.put("/blogs/:id", authMiddleware, adminOrSuperAdminOnly, updateBlog);
router.delete("/blogs/:id", authMiddleware, adminOrSuperAdminOnly, deleteBlog);
router.post("/blogs/:id/like", authMiddleware, likeBlog);
router.post("/blogs/:id/unlike", authMiddleware, unlikeBlog);

export default router;
