import Feedback from "../models/Feedback.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const tryGetUser = async (req) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) return null;
  try {
    const decoded = jwt.verify(auth.split(" ")[1], process.env.JWT_SECRET);
    return await User.findById(decoded.userId).select("fullName userType");
  } catch {
    return null;
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, category, rating, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ message: "Name and message are required" });
    }

    const user = await tryGetUser(req);

    const feedback = await Feedback.create({
      name,
      email,
      category,
      rating: Number(rating) || 5,
      message,
      userType: user?.userType || "",
      userId: user?._id,
    });

    res.status(201).json({
      message: "Thank you! Your feedback has been submitted.",
      feedback,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error submitting feedback", error: err.message });
  }
};

export const getPublicFeedbacks = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 0;
    const query = Feedback.find({ rating: { $gte: 4 } }).sort({ createdAt: -1 });
    if (limit) query.limit(limit);
    const feedbacks = await query;
    res.json(feedbacks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching feedbacks", error: err.message });
  }
};

export const getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching feedbacks", error: err.message });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    const fb = await Feedback.findByIdAndDelete(req.params.id);
    if (!fb) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting feedback", error: err.message });
  }
};
