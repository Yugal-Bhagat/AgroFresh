import express from "express";
import {
  createOrder,
  getMyOrders,
  getFarmerOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/farmer", getFarmerOrders);
router.put("/:id/status", updateOrderStatus);
router.put("/:id/cancel", cancelOrder);

export default router;
