import express from "express";
import {
  rateFarmer,
  getFarmerRatings,
  deleteFarmerRating,
} from "../controllers/farmerRatingController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:farmerId/ratings", getFarmerRatings);
router.post("/:farmerId/ratings", protect, rateFarmer);
router.delete("/ratings/:id", protect, deleteFarmerRating);

export default router;
