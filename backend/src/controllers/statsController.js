import User from "../models/User.js";
import Product from "../models/Product.js";
import Service from "../models/Service.js";
import Scheme from "../models/Scheme.js";

export const getPublicStats = async (req, res) => {
  try {
    const [farmers, customers, products, services, schemes] = await Promise.all([
      User.countDocuments({ userType: "farmer" }),
      User.countDocuments({ userType: "customer" }),
      Product.countDocuments(),
      Service.countDocuments(),
      Scheme.countDocuments(),
    ]);

    res.json({
      farmers,
      customers,
      products,
      services,
      schemes,
      farmingResources: services + schemes,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: err.message });
  }
};
