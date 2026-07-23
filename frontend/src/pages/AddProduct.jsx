import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

const CATEGORIES = [
  "Vegetables",
  "Fruits",
  "Grains",
  "Pulses",
  "Dairy",
  "Spices",
  "Herbs",
  "Oilseeds",
  "Other",
];

const UNITS = [
  "kg",
  "gram",
  "litre",
  "ml",
  "dozen",
  "piece",
  "bunch",
  "quintal",
];

const AddProduct = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userType = localStorage.getItem("userType");
        if (!token) {
            alert("Please login to sell products.");
            navigate("/login", { state: { from: { pathname: "/add-product" } } });
            return;
        }
        if (userType === "customer") {
            alert("You're logged in as a Customer. To sell products, please create or login with a Farmer account.");
            navigate("/marketplace");
        }
    }, [navigate]);

    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        quantityUnit: "",
        category: "",
        description: "",
    });
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const mergeFiles = (existing, incoming) => {
        const seen = new Set(existing.map((f) => `${f.name}-${f.size}`));
        const fresh = incoming.filter((f) => !seen.has(`${f.name}-${f.size}`));
        return [...existing, ...fresh];
    };

    const handleImagesChange = (e) => {
        const incoming = Array.from(e.target.files);
        setImages((prev) => mergeFiles(prev, incoming));
        e.target.value = "";
    };

    const handleVideosChange = (e) => {
        const incoming = Array.from(e.target.files);
        setVideos((prev) => mergeFiles(prev, incoming));
        e.target.value = "";
    };

    const removeImage = (idx) => {
        setImages((prev) => prev.filter((_, i) => i !== idx));
    };

    const removeVideo = (idx) => {
        setVideos((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (images.length === 0) {
            setError("Please upload at least one product image.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setError("Please login first.");
            return;
        }

        try {
            setSubmitting(true);

            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v));
            images.forEach((file) => fd.append("images", file));
            videos.forEach((file) => fd.append("videos", file));

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add product");

            alert("Product added successfully");
            navigate("/farmer-dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="add-product-page">
            <div className="add-product-container">
                <h2 className="page-title">Add New Product</h2>

                <form className="add-product-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" value={form.name} onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price (₹)</label>
                            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Unit</label>
                            <select name="quantityUnit" value={form.quantityUnit} onChange={handleChange} required>
                                <option value="">Select Unit</option>
                                {UNITS.map((u) => (
                                    <option key={u} value={u}>{u}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <select name="category" value={form.category} onChange={handleChange} required>
                                <option value="">Select Category</option>
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Product Images (jpg / png / webp — Ctrl+click to pick many at once, or click again to add more)</label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImagesChange}
                        />
                        <small style={{ color: '#666' }}>
                            {images.length > 0
                                ? `${images.length} image${images.length === 1 ? '' : 's'} selected`
                                : 'No image selected yet'}
                        </small>
                        {images.length > 0 && (
                            <div className="upload-preview">
                                {images.map((file, idx) => (
                                    <div key={idx} className="preview-item">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            className="preview-thumb"
                                        />
                                        <button
                                            type="button"
                                            className="preview-remove"
                                            onClick={() => removeImage(idx)}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Product Videos (mp4 / webm — multiple allowed, optional)</label>
                        <input
                            type="file"
                            accept="video/*"
                            multiple
                            onChange={handleVideosChange}
                        />
                        <small style={{ color: '#666' }}>
                            {videos.length > 0
                                ? `${videos.length} video${videos.length === 1 ? '' : 's'} selected`
                                : 'No video selected'}
                        </small>
                        {videos.length > 0 && (
                            <div className="upload-preview">
                                {videos.map((file, idx) => (
                                    <div key={idx} className="preview-item">
                                        <video
                                            src={URL.createObjectURL(file)}
                                            className="preview-thumb"
                                            muted
                                        />
                                        <button
                                            type="button"
                                            className="preview-remove"
                                            onClick={() => removeVideo(idx)}
                                            title="Remove"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} />
                    </div>

                    {error && <p style={{ color: "crimson" }}>{error}</p>}

                    <button className="submit-btn" type="submit" disabled={submitting}>
                        {submitting ? "Uploading..." : "ADD PRODUCT"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;
