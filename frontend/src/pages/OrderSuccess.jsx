import React from "react";
import { Link, useLocation, Navigate } from "react-router-dom";

const OrderSuccess = () => {
    const location = useLocation();
    const { orders, total } = location.state || {};

    if (!orders) return <Navigate to="/" replace />;

    return (
        <div style={{ minHeight: "70vh", padding: "3rem 1rem", background: "#f8fbf8" }}>
            <div
                style={{
                    maxWidth: "600px",
                    margin: "0 auto",
                    background: "white",
                    padding: "2.5rem",
                    borderRadius: "16px",
                    textAlign: "center",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                }}
            >
                <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>✅</div>
                <h1 style={{ color: "#1b5e20", marginBottom: "0.5rem" }}>
                    Order Placed Successfully!
                </h1>
                <p style={{ color: "#555", marginBottom: "1.5rem" }}>
                    Thank you for your order. {orders.length > 1
                        ? `${orders.length} orders were created (one per farmer).`
                        : "Your order has been placed."}{" "}
                    You'll get updates as it's processed.
                </p>

                {total != null && (
                    <p style={{ fontSize: "1.2rem", color: "#1b5e20", fontWeight: 700 }}>
                        Total Paid: ₹{total.toFixed(2)} (Cash on Delivery)
                    </p>
                )}

                <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <Link
                        to="/my-orders"
                        style={{
                            background: "#2e7d32",
                            color: "white",
                            padding: "10px 20px",
                            borderRadius: "30px",
                            textDecoration: "none",
                            fontWeight: 600,
                        }}
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/marketplace"
                        style={{
                            background: "transparent",
                            color: "#2e7d32",
                            padding: "10px 20px",
                            borderRadius: "30px",
                            textDecoration: "none",
                            fontWeight: 600,
                            border: "2px solid #2e7d32",
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
