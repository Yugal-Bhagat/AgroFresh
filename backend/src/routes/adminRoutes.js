import express from "express";
import {
  getPendingFarmers,
  verifyFarmer,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/pending-farmers", protect, isAdmin, getPendingFarmers);
router.put("/verify/:userId", protect, isAdmin, verifyFarmer);

export default router;
