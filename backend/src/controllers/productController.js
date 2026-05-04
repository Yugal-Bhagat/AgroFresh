import Product from "../models/Product.js";
import User from "../models/User.js";

// ✅ Add Product
export const addProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // 🔐 Only farmer allowed
    if (!user || user.userType !== "farmer") {
      return res.status(403).json({
        message: "Only farmers can add products",
      });
    }

    // 🔐 Only verified farmer
    if (user.verification.status !== "approved") {
      return res.status(403).json({
        message: "Farmer not verified",
      });
    }

    const { name, price, stock, quantityUnit, description, category } =
      req.body;

    // ✅ Basic validation
    if (!name || !price || !stock || !quantityUnit || !category) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const toUrl = (f) => `${baseUrl}/uploads/${f.filename}`;

    const uploadedImages = (req.files?.images || []).map(toUrl);
    const uploadedVideos = (req.files?.videos || []).map(toUrl);

    const fallbackImages = req.body.imageUrl
      ? Array.isArray(req.body.imageUrl)
        ? req.body.imageUrl
        : [req.body.imageUrl]
      : [];

    const images = [...uploadedImages, ...fallbackImages];
    const videos = uploadedVideos;

    const product = await Product.create({
      name,
      price,
      stock,
      quantityUnit,
      description,
      category,
      images,
      videos,
      farmer: user._id,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "farmer"
    );

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer"
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching product",
    });
  }
};

export const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching farmer products",
    });
  }
};
