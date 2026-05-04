import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, notes } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const productIds = items.map((it) => it.product);
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    for (const it of items) {
      const p = productMap.get(it.product.toString());
      if (!p) {
        return res
          .status(400)
          .json({ message: `Product not found: ${it.product}` });
      }
      if (p.stock < it.quantity) {
        return res.status(400).json({
          message: `Only ${p.stock} ${p.quantityUnit} available for ${p.name}`,
        });
      }
    }

    const grouped = new Map();
    for (const it of items) {
      const p = productMap.get(it.product.toString());
      const farmerId = p.farmer.toString();
      if (!grouped.has(farmerId)) grouped.set(farmerId, []);
      grouped.get(farmerId).push({
        product: p._id,
        quantity: it.quantity,
        price: p.price,
      });
    }

    const createdOrders = [];
    for (const [farmerId, orderItems] of grouped.entries()) {
      const totalAmount = orderItems.reduce(
        (sum, oi) => sum + oi.price * oi.quantity,
        0,
      );

      const order = await Order.create({
        customer: req.user._id,
        farmer: farmerId,
        products: orderItems,
        totalAmount,
        shippingAddress,
        notes,
        paymentMethod: paymentMethod || "cod",
        paymentStatus: "pending",
      });

      for (const oi of orderItems) {
        await Product.findByIdAndUpdate(oi.product, {
          $inc: { stock: -oi.quantity },
        });
      }

      createdOrders.push(order);
    }

    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [] },
      { upsert: true },
    );

    res.status(201).json({
      message: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("farmer", "fullName mobile")
      .populate("products.product", "name images quantityUnit")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

export const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate("customer", "fullName mobile email address")
      .populate("products.product", "name images quantityUnit")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    const isFarmer = order.farmer.toString() === req.user._id.toString();
    const isCustomer = order.customer.toString() === req.user._id.toString();
    if (!isFarmer && !isCustomer && req.user.userType !== "admin") {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (status === "delivered") {
      order.paymentStatus = "paid";
    }

    if (status === "cancelled" && order.orderStatus !== "cancelled") {
      for (const oi of order.products) {
        await Product.findByIdAndUpdate(oi.product, {
          $inc: { stock: oi.quantity },
        });
      }
    }

    order.orderStatus = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating order", error: err.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res
        .status(400)
        .json({ message: `Cannot cancel a ${order.orderStatus} order` });
    }

    for (const oi of order.products) {
      await Product.findByIdAndUpdate(oi.product, {
        $inc: { stock: oi.quantity },
      });
    }
    order.orderStatus = "cancelled";
    await order.save();
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error cancelling order", error: err.message });
  }
};
