import Scheme from "../models/Scheme.js";

export const getSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ type: 1, order: 1, createdAt: 1 });
    res.json(schemes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching schemes", error: err.message });
  }
};

export const createScheme = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "title is required" });
    const scheme = await Scheme.create(req.body);
    res.status(201).json(scheme);
  } catch (err) {
    res.status(500).json({ message: "Error creating scheme", error: err.message });
  }
};

export const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ message: "Error updating scheme", error: err.message });
  }
};

export const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: "Scheme not found" });
    res.json({ message: "Scheme deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting scheme", error: err.message });
  }
};
