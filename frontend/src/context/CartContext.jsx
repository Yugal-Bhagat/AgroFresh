import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const CartContext = createContext();
const STORAGE_KEY = "agrofresh_cart";

const readLocal = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeLocal = (items) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
        /* ignore */
    }
};

export const CartProvider = ({ children }) => {
    const [items, setItems] = useState(readLocal);
    const [isHydrating, setIsHydrating] = useState(true);

    const isLoggedIn = () => !!localStorage.getItem("token");

    const persist = useCallback(
        async (newItems) => {
            writeLocal(newItems);
            if (!isLoggedIn()) return;
            try {
                const compact = newItems.map((it) => ({
                    product: it.product._id || it.product,
                    quantity: it.quantity,
                }));
                await fetch("http://localhost:5000/api/cart", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({ items: compact }),
                });
            } catch (err) {
                console.error("Cart sync failed:", err);
            }
        },
        [],
    );

    const setAndPersist = useCallback(
        (updater) => {
            setItems((prev) => {
                const next = typeof updater === "function" ? updater(prev) : updater;
                persist(next);
                return next;
            });
        },
        [persist],
    );

    const addItem = useCallback(
        (product, quantity = 1) => {
            setAndPersist((prev) => {
                const idx = prev.findIndex(
                    (it) => (it.product._id || it.product) === product._id,
                );
                if (idx >= 0) {
                    const max = product.stock || Infinity;
                    const newQty = Math.min(prev[idx].quantity + quantity, max);
                    const next = [...prev];
                    next[idx] = { ...next[idx], quantity: newQty };
                    return next;
                }
                return [...prev, { product, quantity }];
            });
        },
        [setAndPersist],
    );

    const updateQty = useCallback(
        (productId, quantity) => {
            setAndPersist((prev) =>
                prev
                    .map((it) =>
                        (it.product._id || it.product) === productId
                            ? { ...it, quantity: Math.max(1, quantity) }
                            : it,
                    )
                    .filter((it) => it.quantity > 0),
            );
        },
        [setAndPersist],
    );

    const removeItem = useCallback(
        (productId) => {
            setAndPersist((prev) =>
                prev.filter((it) => (it.product._id || it.product) !== productId),
            );
        },
        [setAndPersist],
    );

    const clearCart = useCallback(() => {
        writeLocal([]);
        setItems([]);
        if (isLoggedIn()) {
            fetch("http://localhost:5000/api/cart", {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }).catch(() => {});
        }
    }, []);

    const mergeWithBackend = useCallback(async () => {
        if (!isLoggedIn()) return;
        try {
            const local = readLocal();
            const compact = local.map((it) => ({
                product: it.product._id || it.product,
                quantity: it.quantity,
            }));
            const res = await fetch("http://localhost:5000/api/cart/merge", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ items: compact }),
            });
            if (!res.ok) throw new Error("merge failed");
            const cart = await res.json();
            const merged = (cart.items || [])
                .filter((it) => it.product)
                .map((it) => ({ product: it.product, quantity: it.quantity }));
            setItems(merged);
            writeLocal(merged);
        } catch (err) {
            console.error("Cart merge failed:", err);
        }
    }, []);

    useEffect(() => {
        const init = async () => {
            if (isLoggedIn()) {
                await mergeWithBackend();
            }
            setIsHydrating(false);
        };
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const total = items.reduce(
        (sum, it) => sum + (it.product?.price || 0) * it.quantity,
        0,
    );
    const count = items.reduce((sum, it) => sum + it.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                updateQty,
                removeItem,
                clearCart,
                mergeWithBackend,
                total,
                count,
                isHydrating,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
};
