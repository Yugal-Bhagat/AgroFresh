import Product from "../models/Product.js";
import User from "../models/User.js";
import Review from "../models/Review.js";

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

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const user = await User.findById(req.user.id);
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      req.user.userType !== "admin" &&
      product.farmer.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to update this product" });
    }

    const { name, price, stock, quantityUnit, description, category } = req.body;

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (quantityUnit) product.quantityUnit = quantityUnit;
    if (description !== undefined) product.description = description;
    if (category) product.category = category;

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const toUrl = (f) => `${baseUrl}/uploads/${f.filename}`;

    const parseList = (val) => {
      if (!val) return [];
      if (Array.isArray(val)) return val;
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    };

    const removeImages = parseList(req.body.removeImages);
    const removeVideos = parseList(req.body.removeVideos);

    if (removeImages.length) {
      product.images = product.images.filter((u) => !removeImages.includes(u));
    }
    if (removeVideos.length) {
      product.videos = product.videos.filter((u) => !removeVideos.includes(u));
    }

    if (req.files?.images?.length) {
      const uploadedImages = req.files.images.map(toUrl);
      product.images = [...product.images, ...uploadedImages];
    }

    if (req.files?.videos?.length) {
      const uploadedVideos = req.files.videos.map(toUrl);
      product.videos = [...product.videos, ...uploadedVideos];
    }

    const fallbackImages = req.body.imageUrl
      ? Array.isArray(req.body.imageUrl)
        ? req.body.imageUrl
        : [req.body.imageUrl]
      : [];

    if (fallbackImages.length) {
      product.images = [...new Set([...product.images, ...fallbackImages])];
    }

    await product.save();

    res.json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (
      req.user.userType !== "admin" &&
      product.farmer.toString() !== req.user.id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized to delete this product" });
    }

    await Review.deleteMany({ product: productId });
    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};
