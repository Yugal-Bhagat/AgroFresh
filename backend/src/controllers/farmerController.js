import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import SellerVerification from "../models/SellerVerification.js";
import Review from "../models/Review.js";

// Get farmer dashboard overview
export const getFarmerDashboard = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Get farmer's products count
    const totalProducts = await Product.countDocuments({ farmer: farmerId });

    // Get orders received by farmer
    const orders = await Order.find({ farmer: farmerId });
    const totalOrders = orders.length;

    // Calculate total earnings
    const totalEarnings = orders
      .filter((order) => order.paymentStatus === "paid")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Get farmer's average rating
    const farmer = await User.findById(farmerId);
    const averageRating = farmer.averageRating || 0;

    // Get unique customers count
    const uniqueCustomers = new Set(
      orders.map((order) => order.customer.toString()),
    ).size;

    // Get recent orders (last 5)
    const recentOrders = await Order.find({ farmer: farmerId })
      .populate("customer", "fullName email")
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customer totalAmount orderStatus paymentStatus createdAt");

    // Get top products by sales (assuming we have sales data in products)
    const topProducts = await Product.find({ farmer: farmerId })
      .sort({ numReviews: -1 }) // Using numReviews as proxy for sales
      .limit(5)
      .select("name price rating numReviews");

    res.json({
      totalProducts,
      totalOrders,
      totalEarnings,
      averageRating,
      totalCustomers: uniqueCustomers,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get farmer's products with sales data
export const getFarmerProducts = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const products = await Product.find({ farmer: farmerId })
      .sort({ createdAt: -1 })
      .select("name price stock category images rating numReviews createdAt");

    // For each product, calculate total sold and earnings
    const productsWithSales = await Promise.all(
      products.map(async (product) => {
        // Get orders containing this product
        const ordersWithProduct = await Order.find({
          farmer: farmerId,
          "products.product": product._id,
          paymentStatus: "paid",
        });

        let totalSold = 0;
        let totalEarnings = 0;

        ordersWithProduct.forEach((order) => {
          const productInOrder = order.products.find(
            (p) => p.product.toString() === product._id.toString(),
          );
          if (productInOrder) {
            totalSold += productInOrder.quantity;
            totalEarnings += productInOrder.quantity * productInOrder.price;
          }
        });

        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          stock: product.stock,
          category: product.category,
          images: product.images,
          totalSold,
          totalEarnings,
          rating: product.rating,
          reviews: product.numReviews,
          createdAt: product.createdAt,
        };
      }),
    );

    res.json(productsWithSales);
  } catch (error) {
    console.error("Products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders received by farmer
export const getFarmerOrders = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { status = "all" } = req.query;

    let query = { farmer: farmerId };
    if (status !== "all") {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate("customer", "fullName email mobile address")
      .populate("products.product", "name price images quantityUnit")
      .sort({ createdAt: -1 });

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      customerName: order.customer?.fullName || "—",
      customerEmail: order.customer?.email || "",
      customerPhone: order.customer?.mobile || "",
      customerAddress: order.customer?.address || "",
      shippingAddress: order.shippingAddress || "",
      notes: order.notes || "",
      totalItems: order.products.reduce((sum, p) => sum + p.quantity, 0),
      totalAmount: order.totalAmount,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod || "cod",
      orderDate: order.createdAt,
      productDetails: order.products.map((p) => ({
        name: p.product?.name || "Product",
        quantity: p.quantity,
        price: p.price,
        unit: p.product?.quantityUnit || "",
        image: p.product?.images?.[0] || "",
      })),
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error("Orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get earnings data
export const getFarmerEarnings = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const { period = "month" } = req.query;

    // Get all paid orders for this farmer
    const orders = await Order.find({
      farmer: farmerId,
      paymentStatus: "paid",
    }).sort({ createdAt: 1 });

    const totalEarnings = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0,
    );

    // Calculate monthly data
    const monthlyData = [];
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Group by month
    const monthlyEarnings = {};
    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthlyEarnings[monthKey]) {
        monthlyEarnings[monthKey] = { earnings: 0, orders: 0 };
      }
      monthlyEarnings[monthKey].earnings += order.totalAmount;
      monthlyEarnings[monthKey].orders += 1;
    });

    // Convert to array format
    Object.keys(monthlyEarnings).forEach((monthKey) => {
      const [year, month] = monthKey.split("-");
      monthlyData.push({
        month: monthNames[parseInt(month)],
        earnings: monthlyEarnings[monthKey].earnings,
        orders: monthlyEarnings[monthKey].orders,
      });
    });

    // Get top earning products
    const products = await Product.find({ farmer: farmerId });
    const topEarningProducts = await Promise.all(
      products.map(async (product) => {
        const ordersWithProduct = await Order.find({
          farmer: farmerId,
          "products.product": product._id,
          paymentStatus: "paid",
        });

        let earnings = 0;
        ordersWithProduct.forEach((order) => {
          const productInOrder = order.products.find(
            (p) => p.product.toString() === product._id.toString(),
          );
          if (productInOrder) {
            earnings += productInOrder.quantity * productInOrder.price;
          }
        });

        return {
          productId: product._id,
          name: product.name,
          earnings,
          sold: ordersWithProduct.length,
        };
      }),
    );

    topEarningProducts.sort((a, b) => b.earnings - a.earnings);

    res.json({
      totalEarnings,
      monthlyData,
      topEarningProducts: topEarningProducts.slice(0, 5),
    });
  } catch (error) {
    console.error("Earnings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get farmer ratings and reviews
export const getFarmerRatings = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Get all products by this farmer
    const products = await Product.find({ farmer: farmerId }).select("_id");

    // Get all reviews for these products
    const reviews = await Review.find({
      product: { $in: products.map((p) => p._id) },
    })
      .populate("user", "fullName")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    // Rating breakdown
    const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      ratingBreakdown[review.rating] =
        (ratingBreakdown[review.rating] || 0) + 1;
    });

    // Recent reviews (last 10)
    const recentReviews = reviews.slice(0, 10).map((review) => ({
      reviewId: review._id,
      customerName: review.user.fullName,
      productName: review.product.name,
      rating: review.rating,
      comment: review.comment,
      date: review.createdAt,
    }));

    res.json({
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingBreakdown,
      recentReviews,
    });
  } catch (error) {
    console.error("Ratings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Apply for seller verification
export const applyForVerification = async (req, res) => {
  try {
    const farmerId = req.user._id;
    const {
      farmName,
      farmLocation,
      farmSize,
      cropTypes,
      documents,
      bankDetails,
    } = req.body;

    // Check if farmer already has a pending application
    const existingApplication = await SellerVerification.findOne({
      farmer: farmerId,
      status: "pending",
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You already have a pending verification application",
      });
    }

    // Create new verification application
    const verification = new SellerVerification({
      farmer: farmerId,
      farmName,
      farmLocation,
      farmSize,
      cropTypes,
      documents,
      bankDetails,
      status: "pending",
    });

    await verification.save();

    // Update user with verification application reference
    await User.findByIdAndUpdate(farmerId, {
      sellerVerificationApplication: verification._id,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      applicationId: verification._id,
      status: "pending",
    });
  } catch (error) {
    console.error("Verification application error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Check verification status
export const getVerificationStatus = async (req, res) => {
  try {
    const farmerId = req.user._id;

    const verification = await SellerVerification.findOne({
      farmer: farmerId,
    }).sort({ createdAt: -1 });

    if (!verification) {
      return res.json({
        status: "not_applied",
        isSellingEnabled: false,
        message: "No verification application found",
      });
    }

    const user = await User.findById(farmerId);

    res.json({
      status: verification.status,
      appliedAt: verification.createdAt,
      approvedAt: verification.verificationDate,
      isSellingEnabled: user.isSellingEnabled,
      message:
        verification.status === "rejected"
          ? verification.rejectionReason
          : null,
      adminNotes: verification.adminNotes,
    });
  } catch (error) {
    console.error("Verification status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
