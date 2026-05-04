import express from "express";
import {
  getPendingFarmers,
  verifyFarmer,
  getPendingSellerVerifications,
  processSellerVerification,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

router.get("/pending-farmers", protect, isAdmin, getPendingFarmers);
router.put("/verify/:userId", protect, isAdmin, verifyFarmer);

// Seller verification routes
router.get(
  "/pending-verifications",
  protect,
  isAdmin,
  getPendingSellerVerifications,
);
router.put(
  "/process-verification/:applicationId",
  protect,
  isAdmin,
  processSellerVerification,
);

export default router;
