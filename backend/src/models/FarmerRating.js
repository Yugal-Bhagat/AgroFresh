import mongoose from "mongoose";

const farmerRatingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

farmerRatingSchema.index({ user: 1, farmer: 1 }, { unique: true });

export default mongoose.model("FarmerRating", farmerRatingSchema);
