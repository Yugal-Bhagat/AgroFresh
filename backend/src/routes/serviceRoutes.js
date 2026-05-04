import express from "express";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getServices);
router.post("/", protect, isAdmin, createService);
router.put("/:id", protect, isAdmin, updateService);
router.delete("/:id", protect, isAdmin, deleteService);

export default router;
