import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const statusColor = {
    pending: "#f5a623",
    processing: "#2196f3",
    shipped: "#7b1fa2",
    delivered: "#2e7d32",
    cancelled: "#d32f2f",
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Please login to see orders");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to load orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = async (orderId) => {
        if (!window.confirm("Cancel this order?")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}/cancel`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` },
                },
            );
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to cancel");
            }
            await fetchOrders();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ minHeight: "70vh", padding: "2rem 1rem", background: "#f8fbf8" }}>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <h1 style={{ color: "#1b5e20" }}>My Orders</h1>

                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "crimson" }}>{error}</p>}

                {!loading && orders.length === 0 && (
                    <div
                        style={{
                            background: "white",
                            padding: "3rem",
                            borderRadius: "12px",
                            textAlign: "center",
                        }}
                    >
                        <p>You haven't placed any orders yet.</p>
                        <Link
                            to="/marketplace"
                            style={{
                                display: "inline-block",
                                marginTop: "1rem",
                                background: "#2e7d32",
                                color: "white",
                                padding: "10px 20px",
                                borderRadius: "30px",
                                textDecoration: "none",
                                fontWeight: 600,
                            }}
                        >
                            Browse Marketplace
                        </Link>
                    </div>
                )}

                {orders.map((order) => (
                    <div
                        key={order._id}
                        style={{
                            background: "white",
                            padding: "1.5rem",
                            borderRadius: "12px",
                            marginBottom: "1rem",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                marginBottom: "1rem",
                                gap: "8px",
                            }}
                        >
                            <div>
                                <strong>Order #{order._id.slice(-6).toUpperCase()}</strong>
                                <p style={{ margin: "4px 0", color: "#888", fontSize: "0.85rem" }}>
                                    {new Date(order.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <span
                                style={{
                                    background: statusColor[order.orderStatus] || "#888",
                                    color: "white",
                                    padding: "4px 12px",
                                    borderRadius: "999px",
                                    fontSize: "0.8rem",
                                    fontWeight: 600,
                                    textTransform: "capitalize",
                                }}
                            >
                                {order.orderStatus}
                            </span>
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1rem',
                        }}>
                            <div>
                                <h4 style={{ color: '#1b5e20', margin: '0 0 6px 0' }}>👨‍🌾 Seller</h4>
                                <p style={{ margin: '2px 0' }}><strong>{order.farmer?.fullName || '—'}</strong></p>
                                {order.farmer?.mobile && (
                                    <p style={{ margin: '2px 0', color: '#555' }}>📞 {order.farmer.mobile}</p>
                                )}
                            </div>

                            <div>
                                <h4 style={{ color: '#1b5e20', margin: '0 0 6px 0' }}>📦 Shipping</h4>
                                <p style={{ margin: '2px 0', color: '#555', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                                    {order.shippingAddress || '—'}
                                </p>
                            </div>

                            <div>
                                <h4 style={{ color: '#1b5e20', margin: '0 0 6px 0' }}>💳 Payment</h4>
                                <p style={{ margin: '2px 0' }}>
                                    <strong>Method:</strong>{' '}
                                    {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}
                                </p>
                                <p style={{ margin: '2px 0', textTransform: 'capitalize' }}>
                                    <strong>Status:</strong> {order.paymentStatus}
                                </p>
                            </div>
                        </div>

                        <h4 style={{ color: '#1b5e20', margin: '0 0 6px 0' }}>🛒 Items</h4>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                            {order.products.map((p, idx) => (
                                <li
                                    key={idx}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "12px",
                                        padding: "8px 0",
                                        borderBottom: idx === order.products.length - 1 ? 'none' : '1px solid #f0f0f0',
                                    }}
                                >
                                    {p.product?.images?.[0] && (
                                        <img
                                            src={p.product.images[0]}
                                            alt={p.product.name}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 6 }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <strong>{p.product?.name || "Product"}</strong>
                                        <p style={{ margin: '2px 0', color: '#666', fontSize: '0.85rem' }}>
                                            {p.quantity} {p.product?.quantityUnit || ''} × ₹{p.price}
                                        </p>
                                    </div>
                                    <span style={{ color: '#1b5e20', fontWeight: 600 }}>
                                        ₹{(p.price * p.quantity).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <hr style={{ border: "none", borderTop: "1px solid #e8f5e9", margin: "12px 0" }} />

                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                        >
                            <strong style={{ color: "#1b5e20", fontSize: '1.05rem' }}>
                                Total: ₹{order.totalAmount.toFixed(2)}
                            </strong>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {order.farmer?.mobile && (
                                    <a
                                        href={`tel:${order.farmer.mobile}`}
                                        style={{
                                            background: '#2e7d32',
                                            color: 'white',
                                            padding: '6px 14px',
                                            borderRadius: '20px',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            fontSize: '0.9rem',
                                        }}
                                    >
                                        📞 Contact Farmer
                                    </a>
                                )}
                                {!["shipped", "delivered", "cancelled"].includes(order.orderStatus) && (
                                    <button
                                        onClick={() => handleCancel(order._id)}
                                        style={{
                                            background: "transparent",
                                            color: "#d32f2f",
                                            border: "1px solid #d32f2f",
                                            padding: "6px 14px",
                                            borderRadius: "20px",
                                            cursor: "pointer",
                                        }}
                                    >
                                        Cancel Order
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MyOrders;
