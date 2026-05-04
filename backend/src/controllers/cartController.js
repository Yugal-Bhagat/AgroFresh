import Cart from "../models/Cart.js";

const populateCart = (q) =>
  q.populate({
    path: "items.product",
    populate: { path: "farmer", select: "fullName mobile address rating" },
  });

const sanitizeItems = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((it) => it && it.product && it.quantity > 0)
    .map((it) => ({
      product: it.product,
      quantity: Math.max(1, Number(it.quantity) || 1),
    }));
};

export const getCart = async (req, res) => {
  try {
    let cart = await populateCart(Cart.findOne({ user: req.user._id }));
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
      cart = await populateCart(Cart.findById(cart._id));
    }
    res.json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching cart", error: err.message });
  }
};

export const saveCart = async (req, res) => {
  try {
    const items = sanitizeItems(req.body.items);

    let cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items },
      { new: true, upsert: true },
    );

    cart = await populateCart(Cart.findById(cart._id));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error saving cart", error: err.message });
  }
};

export const mergeCart = async (req, res) => {
  try {
    const guestItems = sanitizeItems(req.body.items);

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = await Cart.create({ user: req.user._id, items: [] });

    const map = new Map();
    cart.items.forEach((it) => {
      map.set(it.product.toString(), it.quantity);
    });
    guestItems.forEach((it) => {
      const key = it.product.toString();
      const existing = map.get(key) || 0;
      map.set(key, Math.max(existing, it.quantity));
    });

    cart.items = Array.from(map.entries()).map(([product, quantity]) => ({
      product,
      quantity,
    }));
    await cart.save();

    cart = await populateCart(Cart.findById(cart._id));
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Error merging cart", error: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true },
    );
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error clearing cart", error: err.message });
  }
};
