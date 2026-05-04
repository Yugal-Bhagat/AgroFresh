import mongoose from "mongoose";

const sellerVerificationSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmName: {
      type: String,
      required: true,
    },

    farmLocation: {
      type: String,
      required: true,
    },

    farmSize: {
      type: Number, // in acres
      required: true,
    },

    cropTypes: [
      {
        type: String,
        enum: [
          "vegetables",
          "fruits",
          "grains",
          "dairy",
          "pulses",
          "spices",
          "other",
        ],
      },
    ],

    documents: [
      {
        type: String, // image URL or file path
      },
    ],

    bankDetails: {
      accountNumber: {
        type: String,
        required: true,
      },
      ifscCode: {
        type: String,
        required: true,
      },
      accountHolderName: {
        type: String,
        required: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    verificationDate: {
      type: Date,
    },

    adminNotes: {
      type: String,
    },

    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("SellerVerification", sellerVerificationSchema);
