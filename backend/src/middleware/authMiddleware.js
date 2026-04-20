import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Protect middleware - Verifies JWT token and attaches user to request
 * Use this for routes that require authentication
 */
const protect = async (req, res, next) => {
    let token;

    // Extract token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    // Check if token exists
    if (!token) {
        return res.status(401).json({
            message: "Not authorized. No token provided."
        });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user by ID from token (exclude password)
        const user = await User.findById(decoded.userId).select("-password");

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "Not authorized. User not found."
            });
        }

        // Attach user to request object
        req.user = user;
        req.userId = user._id;
        req.userType = user.userType;

        // Optional: Log for debugging (remove in production)
        if (process.env.NODE_ENV === "development") {
            console.log(`✅ Authenticated: ${user.email} (${user.userType})`);
        }

        next();
    } catch (err) {
        console.error("Token verification error:", err.message);

        // Handle different JWT errors
        if (err.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Invalid token. Please login again."
            });
        }

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expired. Please login again."
            });
        }

        // Generic error
        res.status(401).json({
            message: "Not authorized. Token verification failed."
        });
    }
};

/**
 * Admin middleware - Restricts access to admin users only
 * Use this after protect middleware
 */
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.userType === "admin") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Admin only."
        });
    }
};

/**
 * Farmer middleware - Restricts access to farmers only
 * Use this after protect middleware
 */
export const farmerOnly = (req, res, next) => {
    if (req.user && req.user.userType === "farmer") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Farmers only."
        });
    }
};

/**
 * Customer middleware - Restricts access to customers only
 * Use this after protect middleware
 */
export const customerOnly = (req, res, next) => {
    if (req.user && req.user.userType === "customer") {
        next();
    } else {
        res.status(403).json({
            message: "Access denied. Customers only."
        });
    }
};

export default protect;