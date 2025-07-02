import { Router } from "express";
import {
  createOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  deleteOrder,
  getOrdersByUserId,
} from "./order.controller";
import { adminOrSuperAdminOnly, authMiddleware, ownerOnly } from "../../middlewares/auth";

const router = Router();

router.post("/orders", authMiddleware, createOrder);
router.put("/orders/:id", authMiddleware, ownerOnly, updateOrder);
router.get("/orders/:id", authMiddleware, ownerOnly, getOrderById);
router.get("/orders/user/:userId", authMiddleware, ownerOnly, getOrdersByUserId);
router.get("/orders", adminOrSuperAdminOnly, getAllOrders);
router.delete("/orders/:id", authMiddleware, ownerOnly, deleteOrder);

export default router;
