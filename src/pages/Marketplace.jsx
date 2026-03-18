import React, { useState } from 'react';
import { Link } from 'react-router-dom';   // 👈 Import Link
import './Marketplace.css';

const Marketplace = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');
  const [nearby, setNearby] = useState(false);

  const categories = ['all', 'vegetables', 'fruits', 'grains', 'dairy', 'seeds', 'fertilizers'];

  const products = [
    { id: 1, name: 'Fresh Tomatoes', farmer: 'Ramesh Kumar', city: 'Delhi', price: 40, unit: 'kg', rating: 4.5, distance: 10, organic: true, category: 'vegetables', image: '🍅', verified: true },
    { id: 2, name: 'Organic Apples', farmer: 'Priya Sharma', city: 'Shimla', price: 120, unit: 'kg', rating: 5, distance: 15, organic: true, category: 'fruits', image: '🍎', verified: true },
    { id: 3, name: 'Basmati Rice', farmer: 'Gurpreet Singh', city: 'Amritsar', price: 80, unit: 'kg', rating: 4, distance: 25, organic: false, category: 'grains', image: '🌾', verified: false },
    { id: 4, name: 'Cow Milk', farmer: 'Dairy Fresh', city: 'Pune', price: 50, unit: 'litre', rating: 4.8, distance: 5, organic: true, category: 'dairy', image: '🥛', verified: true },
    { id: 5, name: 'Potatoes', farmer: 'Hari Ram', city: 'Agra', price: 30, unit: 'kg', rating: 4.2, distance: 8, organic: false, category: 'vegetables', image: '🥔', verified: false },
    { id: 6, name: 'Organic Wheat', farmer: 'Green Fields', city: 'Indore', price: 45, unit: 'kg', rating: 4.6, distance: 12, organic: true, category: 'grains', image: '🌾', verified: true },
    { id: 7, name: 'Hybrid Seeds', farmer: 'AgriSeed Co.', city: 'Nagpur', price: 250, unit: 'pack', rating: 4.3, distance: 30, organic: false, category: 'seeds', image: '🌱', verified: true },
    { id: 8, name: 'Organic Fertilizer', farmer: 'EcoGrow', city: 'Lucknow', price: 400, unit: 'bag', rating: 4.7, distance: 20, organic: true, category: 'fertilizers', image: '🧪', verified: false },
    { id: 9, name: 'Fresh Carrots', farmer: 'Veggie Farms', city: 'Nashik', price: 35, unit: 'kg', rating: 4.4, distance: 7, organic: true, category: 'vegetables', image: '🥕', verified: true },
    { id: 10, name: 'Free Range Eggs', farmer: 'Happy Hens', city: 'Bengaluru', price: 90, unit: 'dozen', rating: 4.9, distance: 12, organic: true, category: 'dairy', image: '🥚', verified: true },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesNearby = nearby ? product.distance <= 15 : true;
    const matchesLocation = location === '' || product.city.toLowerCase().includes(location.toLowerCase());
    return matchesSearch && matchesCategory && matchesNearby && matchesLocation;
  });

  return (
    <div className="marketplace-page">
      <div className="marketplace-container">
        
        {/* Header */}
        <div className="page-header">
          <h1>Farmers' Marketplace</h1>
          <p>Fresh produce directly from local farmers</p>
        </div>

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
                to={`/product/${product.id}`}
                key={product.id}
                className="product-link"    // 👈 Link wrapper
              >
                <div className="product-card">
                  <div className="product-image">{product.image}</div>
                  <div className="product-details">
                    <h3>{product.name}</h3>
                    <p className="farmer-name">
                      {product.farmer}
                      {product.verified && <span className="verified-badge" title="Verified Farmer">✓</span>}
                    </p>
                    <p className="product-price">₹{product.price}/{product.unit}</p>
                    <div className="product-meta">
                      <span className="rating">⭐ {product.rating}</span>
                      <span className="location">📍 {product.city} • {product.distance} km</span>
                    </div>
                    {product.organic && <span className="organic-tag">Organic</span>}
                  </div>
                  <button className="add-to-cart">Add to Cart</button>
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