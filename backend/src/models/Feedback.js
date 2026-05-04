import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    category: { type: String, default: "general" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    message: { type: String, required: true },
    userType: { type: String, default: "" },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Feedback", feedbackSchema);
