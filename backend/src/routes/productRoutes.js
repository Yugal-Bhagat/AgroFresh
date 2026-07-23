import express from "express";
import {
  addProduct,
  getAllProducts,
  getProductById,
  getFarmerProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import protect from "../middleware/authMiddleware.js";
import { productMediaUpload } from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, productMediaUpload, addProduct);
router.put("/:id", protect, productMediaUpload, updateProduct);
router.delete("/:id", protect, deleteProduct);
router.get("/", getAllProducts);
router.get("/farmer/my-products", protect, getFarmerProducts);
router.get("/:id", getProductById);

export default router;
