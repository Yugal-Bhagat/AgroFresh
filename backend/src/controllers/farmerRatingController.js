import FarmerRating from "../models/FarmerRating.js";
import User from "../models/User.js";

const recomputeFarmerDirectRating = async (farmerId) => {
  const ratings = await FarmerRating.find({ farmer: farmerId });
  const count = ratings.length;
  const avg =
    count > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / count
      : 0;

  await User.findByIdAndUpdate(farmerId, {
    farmerAvgRating: Number(avg.toFixed(2)),
    farmerRatingCount: count,
  });

  return { avg: Number(avg.toFixed(2)), count };
};

export const rateFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.userType !== "farmer") {
      return res.status(404).json({ message: "Farmer not found" });
    }

    if (req.user._id.toString() === farmerId.toString()) {
      return res.status(400).json({ message: "You cannot rate yourself" });
    }

    const existing = await FarmerRating.findOne({
      user: req.user._id,
      farmer: farmerId,
    });

    let saved;
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      saved = await existing.save();
    } else {
      saved = await FarmerRating.create({
        user: req.user._id,
        farmer: farmerId,
        rating,
        comment,
      });
    }

    const stats = await recomputeFarmerDirectRating(farmerId);

    res.status(existing ? 200 : 201).json({
      message: existing ? "Rating updated" : "Rating submitted",
      rating: saved,
      stats,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error rating farmer",
      error: err.message,
    });
  }
};

export const getFarmerRatings = async (req, res) => {
  try {
    const { farmerId } = req.params;

    const farmer = await User.findById(farmerId);
    if (!farmer || farmer.userType !== "farmer") {
      return res.status(404).json({ message: "Farmer not found" });
    }

    const ratings = await FarmerRating.find({ farmer: farmerId })
      .populate("user", "fullName")
      .sort({ createdAt: -1 });

    const count = ratings.length;
    const avg =
      count > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / count
        : 0;

    const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r) => {
      breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
    });

    res.json({
      avg: Number(avg.toFixed(2)),
      count,
      breakdown,
      ratings,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error fetching farmer ratings",
      error: err.message,
    });
  }
};

export const deleteFarmerRating = async (req, res) => {
  try {
    const rating = await FarmerRating.findById(req.params.id);
    if (!rating) {
      return res.status(404).json({ message: "Rating not found" });
    }

    if (
      rating.user.toString() !== req.user._id.toString() &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const farmerId = rating.farmer;
    await rating.deleteOne();
    await recomputeFarmerDirectRating(farmerId);

    res.json({ message: "Rating deleted" });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting rating",
      error: err.message,
    });
  }
};
