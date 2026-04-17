import express from "express";
import cors from "cors";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 🔹 Health check (important for testing)
app.get("/", (req, res) => {
  res.send("AgroFresh API running...");
});

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
// app.use("/api/reviews", reviewRoutes);

// ❌ Route not found handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

export default app;
