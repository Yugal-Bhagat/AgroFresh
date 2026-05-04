import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
    const { items, updateQty, removeItem, clearCart, total } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login", { state: { from: { pathname: "/checkout" } } });
            return;
        }
        navigate("/checkout");
    };

    if (items.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-empty">
                    <div className="cart-empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Browse our marketplace to add fresh products.</p>
                    <Link to="/marketplace" className="cart-cta">Go to Marketplace</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="cart-container">
                <h1>Your Cart</h1>

                <div className="cart-grid">
                    <div className="cart-items">
                        {items.map((it) => {
                            const p = it.product;
                            const stock = p.stock ?? Infinity;
                            return (
                                <div key={p._id} className="cart-item">
                                    <img
                                        src={p.images?.[0] || "https://via.placeholder.com/100"}
                                        alt={p.name}
                                        className="cart-item-img"
                                    />
                                    <div className="cart-item-info">
                                        <Link to={`/product/${p._id}`} className="cart-item-name">
                                            {p.name}
                                        </Link>
                                        <p className="cart-item-price">
                                            ₹{p.price}/{p.quantityUnit}
                                        </p>
                                        {p.farmer?.fullName && (
                                            <p className="cart-item-seller">
                                                by {p.farmer.fullName}
                                            </p>
                                        )}
                                    </div>
                                    <div className="cart-item-actions">
                                        <div className="qty-control">
                                            <button
                                                onClick={() => updateQty(p._id, it.quantity - 1)}
                                                disabled={it.quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <span>{it.quantity}</span>
                                            <button
                                                onClick={() => updateQty(p._id, it.quantity + 1)}
                                                disabled={it.quantity >= stock}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <p className="cart-item-subtotal">
                                            ₹{(p.price * it.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            className="cart-remove-btn"
                                            onClick={() => removeItem(p._id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            );
                        })}

                        <button className="cart-clear-btn" onClick={clearCart}>
                            Clear Cart
                        </button>
                    </div>

                    <aside className="cart-summary">
                        <h3>Order Summary</h3>
                        <div className="summary-row">
                            <span>Subtotal</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        <div className="summary-row">
                            <span>Delivery</span>
                            <span>{total >= 500 ? "FREE" : "₹40"}</span>
                        </div>
                        <hr />
                        <div className="summary-row total-row">
                            <strong>Total</strong>
                            <strong>
                                ₹{(total + (total >= 500 ? 0 : 40)).toFixed(2)}
                            </strong>
                        </div>
                        <button className="checkout-btn" onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                        <Link to="/marketplace" className="continue-link">
                            ← Continue shopping
                        </Link>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default Cart;
