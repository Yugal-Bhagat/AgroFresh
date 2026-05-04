import express from "express";
import {
  getSchemes,
  createScheme,
  updateScheme,
  deleteScheme,
} from "../controllers/schemeController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/", getSchemes);
router.post("/", protect, isAdmin, createScheme);
router.put("/:id", protect, isAdmin, updateScheme);
router.delete("/:id", protect, isAdmin, deleteScheme);

export default router;
