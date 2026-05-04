import Wishlist from "../models/Wishlist.js";

const populateWishlist = (q) =>
  q.populate({
    path: "products",
    populate: { path: "farmer", select: "fullName mobile" },
  });

export const getWishlist = async (req, res) => {
  try {
    let wishlist = await populateWishlist(
      Wishlist.findOne({ user: req.user._id }),
    );
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
      wishlist = await populateWishlist(Wishlist.findById(wishlist._id));
    }
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching wishlist", error: err.message });
  }
};

export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ message: "productId required" });

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        user: req.user._id,
        products: [productId],
      });
    } else if (!wishlist.products.find((p) => p.toString() === productId)) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    wishlist = await populateWishlist(Wishlist.findById(wishlist._id));
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding to wishlist", error: err.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.json({ products: [] });

    wishlist.products = wishlist.products.filter(
      (p) => p.toString() !== req.params.productId,
    );
    await wishlist.save();

    wishlist = await populateWishlist(Wishlist.findById(wishlist._id));
    res.json(wishlist);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing from wishlist", error: err.message });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    await Wishlist.findOneAndUpdate(
      { user: req.user._id },
      { products: [] },
      { upsert: true },
    );
    res.json({ message: "Wishlist cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing wishlist", error: err.message });
  }
};
