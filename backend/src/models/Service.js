import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    icon: { type: String, default: "🌱" },
    title: { type: String, required: true },
    desc: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Service", serviceSchema);
