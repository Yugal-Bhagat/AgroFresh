import express from "express";
import {
  submitMessage,
  getMessages,
  markMessageRead,
  deleteMessage,
} from "../controllers/contactController.js";
import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.post("/", submitMessage);
router.get("/", protect, isAdmin, getMessages);
router.put("/:id/read", protect, isAdmin, markMessageRead);
router.delete("/:id", protect, isAdmin, deleteMessage);

export default router;
