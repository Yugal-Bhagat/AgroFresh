import React, { useState } from "react";
import "./AddProduct.css";

const AddProduct = () => {
    const [form, setForm] = useState({
        name: "",
        price: "",
        stock: "",
        quantityUnit: "",
        category: "",
        description: "",
        image: ""
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:5000/api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...form,
                    images: [form.image]
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Product added successfully");
            } else {
                alert(data.message);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="add-product-page">
            <div className="add-product-container">
                <h2 className="page-title">Add New Product</h2>

                <form className="add-product-form" onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Product Name</label>
                        <input name="name" onChange={handleChange} required />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Price</label>
                            <input name="price" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Stock</label>
                            <input name="stock" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Unit (kg, litre)</label>
                            <input name="quantityUnit" onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label>Category</label>
                            <input name="category" onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input name="image" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" onChange={handleChange} />
                    </div>

                    <button className="submit-btn" type="submit">
                        ADD PRODUCT
                    </button>

                </form>
            </div>
        </div>
    );
};

export default AddProduct;