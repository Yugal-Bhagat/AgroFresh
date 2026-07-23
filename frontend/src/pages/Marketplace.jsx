import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Marketplace.css';

const Marketplace = () => {
  const userType = localStorage.getItem("userType");
  const { addItem } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [nearby, setNearby] = useState(false);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'seeds', 'fertilizers'];

  // ✅ Fetch from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
        const data = await res.json();

        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Keep SAME filter logic but adapt fields
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesLocation =
      location === '' ||
      product.farmer?.address?.toLowerCase().includes(location.toLowerCase());

    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  return (
    <div className="marketplace-page">
      <div className="marketplace-container">

        {/* Header */}
        <div className="page-header">
          <h1>Farmers' Marketplace</h1>
          <p>Fresh produce directly from local farmers</p>
        </div>

        {userType === "farmer" && (
          <div className="add-product-wrapper">
            <Link to="/add-product" className="add-product-btn">
              + Add Product
            </Link>
          </div>
        )}

        {/* Location & Search Bar */}
        <div className="toolbar">
          <div className="location-bar">
            <span className="location-icon">📍</span>
            <input
              type="text"
              placeholder="Filter by city (e.g., Delhi)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button className={`nearby-btn ${nearby ? 'active' : ''}`} onClick={() => setNearby(!nearby)}>
              {nearby ? '📍 Nearby On' : '📍 Nearby'}
            </button>
          </div>

          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search products or farmers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map(product => (
              <Link
                to={`/product/${product._id}`}   // ✅ important change
                key={product._id}
                className="product-link"
              >
                <div className="product-card">

                  {/* IMAGE */}
                  <div className="product-image">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/150"}
                      alt={product.name}
                    />
                  </div>

                  {/* DETAILS */}
                  <div className="product-details">
                    <h3>{product.name}</h3>

                    <p className="farmer-name">
                      {product.farmer?.fullName}
                    </p>

                    <p className="product-price">
                      ₹{product.price}/{product.quantityUnit}
                    </p>

                    <div className="product-meta">
                      <span className="rating">⭐ {product.rating}</span>

                      <span className="location">
                        📍 {product.farmer?.address || "Unknown"}
                      </span>
                    </div>

                    {/* Optional: show verified */}
                    {product.farmer?.verification?.status === "approved" && (
                      <span className="verified-badge">✓</span>
                    )}
                  </div>

                  <button
                    className="add-to-cart"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (userType === "farmer") {
                        alert("You're logged in as a Farmer. To buy products, please create or login with a Customer account.");
                        return;
                      }
                      addItem(product, 1);
                      alert(`${product.name} added to cart`);
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-products">
              <p>No products match your criteria. Try adjusting filters.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Marketplace;