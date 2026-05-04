import Service from "../models/Service.js";

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: 1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: "Error fetching services", error: err.message });
  }
};

export const createService = async (req, res) => {
  try {
    const { icon, title, desc, order } = req.body;
    if (!title || !desc) {
      return res.status(400).json({ message: "title and desc are required" });
    }
    const service = await Service.create({ icon, title, desc, order });
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ message: "Error creating service", error: err.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: "Error updating service", error: err.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting service", error: err.message });
  }
};
