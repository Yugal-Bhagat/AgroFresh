import express from "express";
import { uploadVerificationDoc } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload-document", protect, uploadVerificationDoc);

export default router;
