import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const Checkout = () => {
    const { items, total, clearCart } = useCart();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        fullName: localStorage.getItem("userName") || "",
        phone: "",
        addressLine: "",
        city: "",
        state: "",
        pincode: "",
        notes: "",
        paymentMethod: "cod",
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    if (items.length === 0) {
        return (
            <div className="checkout-page">
                <div className="checkout-empty">
                    <h2>Your cart is empty</h2>
                    <button onClick={() => navigate("/marketplace")}>
                        Go to Marketplace
                    </button>
                </div>
            </div>
        );
    }

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const deliveryFee = total >= 500 ? 0 : 40;
    const grandTotal = total + deliveryFee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { state: { from: { pathname: "/checkout" } } });
            return;
        }

        const shippingAddress = `${form.fullName}, ${form.phone}\n${form.addressLine}\n${form.city}, ${form.state} - ${form.pincode}`;

        try {
            setSubmitting(true);
            const compactItems = items.map((it) => ({
                product: it.product._id,
                quantity: it.quantity,
            }));

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    items: compactItems,
                    shippingAddress,
                    paymentMethod: form.paymentMethod,
                    notes: form.notes,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to place order");

            clearCart();
            navigate("/order-success", {
                state: { orders: data.orders, total: grandTotal },
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="checkout-page">
            <div className="checkout-container">
                <h1>Checkout</h1>

                <div className="checkout-grid">
                    <form className="checkout-form" onSubmit={handlePlaceOrder}>
                        <h3>Shipping Details</h3>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Address Line *</label>
                            <input
                                name="addressLine"
                                value={form.addressLine}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    name="city"
                                    value={form.city}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State *</label>
                                <input
                                    name="state"
                                    value={form.state}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    name="pincode"
                                    value={form.pincode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Order Notes (optional)</label>
                            <textarea
                                name="notes"
                                rows="3"
                                value={form.notes}
                                onChange={handleChange}
                            />
                        </div>

                        <h3>Payment Method</h3>
                        <div className="payment-methods">
                            <label className="payment-option">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={form.paymentMethod === "cod"}
                                    onChange={handleChange}
                                />
                                <span>💵 Cash on Delivery</span>
                            </label>
                            <label className="payment-option disabled">
                                <input type="radio" name="paymentMethod" value="online" disabled />
                                <span>💳 Online Payment (Coming Soon)</span>
                            </label>
                        </div>

                        {error && <p style={{ color: "crimson" }}>{error}</p>}

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={submitting}
                        >
                            {submitting ? "Placing Order..." : `Place Order — ₹${grandTotal.toFixed(2)}`}
                        </button>
                    </form>

                    <aside className="checkout-summary">
                        <h3>Your Order ({items.length} item{items.length !== 1 ? "s" : ""})</h3>
                        <ul className="summary-items">
                            {items.map((it) => (
                                <li key={it.product._id}>
                                    <span>
                                        {it.product.name} × {it.quantity}
                                    </span>
                                    <span>
                                        ₹{(it.product.price * it.quantity).toFixed(2)}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <hr />
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>{deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}</span>
                        </div>
                        <hr />
                        <div className="summary-row total-row">
                            <strong>Total</strong>
                            <strong>₹{grandTotal.toFixed(2)}</strong>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
