import express from "express";
import {
  getFarmerDashboard,
  getFarmerProducts,
  getFarmerOrders,
  getFarmerEarnings,
  getFarmerRatings,
  applyForVerification,
  getVerificationStatus,
} from "../controllers/farmerController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Farmer dashboard overview
router.get("/dashboard", getFarmerDashboard);

// Farmer's products with sales data
router.get("/products", getFarmerProducts);

// Orders received by farmer
router.get("/orders", getFarmerOrders);

// Earnings data
router.get("/earnings", getFarmerEarnings);

// Ratings and reviews
router.get("/ratings", getFarmerRatings);

// Seller verification
router.post("/apply-verification", applyForVerification);
router.get("/verification-status", getVerificationStatus);

export default router;
