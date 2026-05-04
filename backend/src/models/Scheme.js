import mongoose from "mongoose";

const schemeSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["main", "new"], default: "main" },
    title: { type: String, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    benefit: { type: String, default: "" },
    deadline: { type: String, default: "" },
    status: { type: String, default: "active" },
    icon: { type: String, default: "🏛" },
    link: { type: String, default: "" },
    details: { type: String, default: "" },
    source: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export default mongoose.model("Scheme", schemeSchema);
