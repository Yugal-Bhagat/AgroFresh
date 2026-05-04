import express from "express";
import {
  getCart,
  saveCart,
  mergeCart,
  clearCart,
} from "../controllers/cartController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getCart);
router.put("/", saveCart);
router.post("/merge", mergeCart);
router.delete("/", clearCart);

export default router;
