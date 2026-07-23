import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      city: String,
      state: String,
      pincode: String,
    },

    userType: {
      type: String,
      enum: ["farmer", "customer", "admin"],
      default: "customer",
    },

    profileImage: {
      type: String,
    },

    verification: {
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      document: String,
      verifiedAt: Date,
    },

    farmerDetails: {
      farmName: String,
      farmLocation: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    // Direct farmer ratings (from "Rate this farmer" on product page)
    farmerAvgRating: {
      type: Number,
      default: 0,
    },

    farmerRatingCount: {
      type: Number,
      default: 0,
    },

    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String,
    },

    // Farmer dashboard fields
    totalEarnings: {
      type: Number,
      default: 0,
    },

    totalSales: {
      type: Number,
      default: 0,
    },

    averageRating: {
      type: Number,
      default: 0,
    },

    isSellingEnabled: {
      type: Boolean,
      default: false,
    },

    sellerVerificationApplication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SellerVerification",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
