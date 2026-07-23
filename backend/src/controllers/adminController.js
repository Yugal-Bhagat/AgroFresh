import User from "../models/User.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";
import SellerVerification from "../models/SellerVerification.js";

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

export const getPendingFarmers = async (req, res) => {
  const farmers = await User.find({
    userType: "farmer",
    "verification.status": "pending",
  });

  res.json(farmers);
};

export const verifyFarmer = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    const user = await User.findById(req.params.userId);

    user.verification.status = status;
    user.verification.verifiedAt = new Date();

    await user.save();

    res.json({
      message: `Farmer ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'fullName email')
      .populate({
        path: 'product',
        select: 'name farmer',
        populate: { path: 'farmer', select: 'fullName email' },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
};

export const deleteReviewByAdmin = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const productId = review.product;
    const product = await Product.findById(productId);

    await review.deleteOne();
    await recomputeProductRating(productId);
    if (product) await recomputeFarmerRating(product.farmer);

    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete review",
      error: error.message,
    });
  }
};

// Get pending seller verification applications
export const getPendingSellerVerifications = async (req, res) => {
  try {
    const applications = await SellerVerification.find({
      status: "pending",
    }).populate("farmer", "fullName email mobile address");

    res.json(applications);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applications",
    });
  }
};

// Approve or reject seller verification
export const processSellerVerification = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, adminNotes, rejectionReason } = req.body;

    const application = await SellerVerification.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    application.adminNotes = adminNotes;

    if (status === "rejected") {
      application.rejectionReason = rejectionReason;
    } else if (status === "approved") {
      application.verificationDate = new Date();

      // Update user to enable selling
      await User.findByIdAndUpdate(application.farmer, {
        isSellingEnabled: true,
      });
    }

    await application.save();

    res.json({
      message: `Seller verification ${status}`,
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification processing failed",
    });
  }
};
