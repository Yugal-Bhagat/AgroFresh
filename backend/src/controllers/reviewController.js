import Review from "../models/Review.js";
import Product from "../models/Product.js";
import User from "../models/User.js";

const recomputeProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating =
    numReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews
      : 0;

  await Product.findByIdAndUpdate(productId, {
    rating: Number(rating.toFixed(2)),
    numReviews,
  });

  return { rating, numReviews };
};

const recomputeFarmerRating = async (farmerId) => {
  const farmerProducts = await Product.find({ farmer: farmerId }).select("_id");
  const productIds = farmerProducts.map((p) => p._id);

  const reviews = await Review.find({ product: { $in: productIds } });
  const totalReviews = reviews.length;
  const avg =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  await User.findByIdAndUpdate(farmerId, {
    rating: Number(avg.toFixed(2)),
    averageRating: Number(avg.toFixed(2)),
    totalReviews,
  });
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const existing = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    let review;
    if (existing) {
      existing.rating = rating;
      existing.comment = comment;
      review = await existing.save();
    } else {
      review = await Review.create({
        product: productId,
        user: req.user._id,
        rating,
        comment,
      });
    }

    await recomputeProductRating(productId);
    await recomputeFarmerRating(product.farmer);

    const populated = await Review.findById(review._id).populate(
      "user",
      "fullName profileImage",
    );

    res.status(existing ? 200 : 201).json(populated);
  } catch (err) {
    res.status(500).json({ message: "Error creating review", error: err.message });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "fullName profileImage")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.userType !== "admin"
    ) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const productId = review.product;
    const product = await Product.findById(productId);

    await review.deleteOne();
    await recomputeProductRating(productId);
    if (product) await recomputeFarmerRating(product.farmer);

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting review", error: err.message });
  }
};
