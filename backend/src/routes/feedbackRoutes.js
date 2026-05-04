import express from "express";
import {
  submitFeedback,
  getPublicFeedbacks,
  getAllFeedbacks,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", submitFeedback);
router.get("/", getPublicFeedbacks);
router.get("/admin", protect, isAdmin, getAllFeedbacks);
router.delete("/:id", protect, isAdmin, deleteFeedback);

export default router;
