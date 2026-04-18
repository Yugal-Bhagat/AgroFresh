import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Product.css';

const Product = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        const data = await res.json();

        setProduct(data);
        setReviews([]); // until backend reviews

        const res2 = await fetch(`http://localhost:5000/api/products`);
        const allProducts = await res2.json();

        const filtered = allProducts.filter(
          (p) => p.category === data.category && p._id !== data._id
        );

        setRelatedProducts(filtered);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  // ✅ FIXED (no fake data)
  const images = product.images || [];

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product.stock) setQuantity(val);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const review = {
      id: Date.now(),
      user: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews([review, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
      : product.rating;

  return (
    <div className="product-page">
      <div className="product-page-container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt;
          <Link to="/marketplace"> Marketplace</Link> &gt;
          <span>{product.name}</span>
        </div>

        <div className="product-main">

          {/* LEFT */}
          <div className="product-gallery">
            <div className="main-image">
              <img
                src={images[activeImage] || "https://via.placeholder.com/200"}
                alt={product.name}
              />
            </div>

            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt=""
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                />
              ))}
            </div>
          </div>

          {/* MIDDLE */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <span className="rating-stars">⭐ {avgRating}</span>
              <span className="rating-count">({product.numReviews} reviews)</span>
            </div>

            <div className="product-price-section">
              <span className="price-currency">₹</span>
              <span className="price-amount">{product.price}</span>
              <span className="price-unit">/{product.quantityUnit}</span>
            </div>

            {/* ✅ FIXED SELLER */}
            <div className="product-seller">
              <div className="seller-row">
                <span className="seller-name">
                  {product.farmer?.fullName}
                  {product.farmer?.verification?.status === "approved" && (
                    <span className="verified-badge-large">✓</span>
                  )}
                </span>
              </div>

              <div className="seller-contact">
                <span className="seller-phone">
                  📞 {product.farmer?.mobile || "N/A"}
                </span>

                <span className="seller-location">
                  📍 {product.farmer?.address || "Unknown"}
                </span>
              </div>
            </div>

            {/* STOCK */}
            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* ACTIONS */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label>Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>

              <div className="action-buttons">
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="buy-now-btn">Buy Now</button>
              </div>
            </div>

            <div className="delivery-info">
              <p>🚚 Free delivery on orders above ₹500</p>
              <p>⏱️ Usually delivers in 2-3 days</p>
            </div>
          </div>

          {/* RIGHT SIDEBAR (UI SAME, FIXED DATA) */}
          <div className="product-sidebar">
            <div className="seller-card">
              <h4>Seller Information</h4>
              <p><strong>{product.farmer?.fullName}</strong></p>
              <p>📍 {product.farmer?.address}</p>
              <p>⭐ {product.rating}</p>
              <p>📞 {product.farmer?.mobile}</p>
              <p>📦 Ships within 24 hours</p>
            </div>

            <div className="offer-card">
              <h4>Available Offers</h4>
              <ul>
                <li>🎉 5% off on first purchase</li>
                <li>💳 No cost EMI on orders above ₹1000</li>
                <li>🌾 Special discount for farmers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* REVIEWS (same UI, local state for now) */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>

          <div className="review-summary">
            <div className="average-rating">
              <span className="big-rating">{avgRating}</span>
              <span className="stars">⭐</span>
              <span className="total-reviews">
                Based on {totalReviews} reviews
              </span>
            </div>

            <button
              className="write-review-btn"
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {showReviewForm && (
            <div className="review-form">
              <h3>Write Your Review</h3>
              <form onSubmit={handleReviewSubmit}>

                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) =>
                      setNewReview({ ...newReview, name: e.target.value })
                    }
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) =>
                      setNewReview({ ...newReview, comment: e.target.value })
                    }
                    placeholder="Write your experience..."
                    required
                  />
                </div>

                <button type="submit" className="submit-review-btn">
                  Submit Review
                </button>

              </form>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className="review-card">
                  <p><strong>{r.user}</strong></p>
                  <p>{r.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet</p>
            )}
          </div>
        </div>

        {/* RELATED (UI SAME GRID) */}
        <div className="related-products">
          <h2>Related Products</h2>

          <div className="related-grid">
            {relatedProducts.length > 0 ? (
              relatedProducts.map(rel => (
                <Link
                  to={`/product/${rel._id}`}
                  key={rel._id}
                  className="related-card"
                >
                  <div className="related-image">
                    <img src={rel.images?.[0]} alt="" />
                  </div>

                  <div className="related-info">
                    <h4>{rel.name}</h4>
                    <p>₹{rel.price}/{rel.quantityUnit}</p>
                  </div>
                </Link>
              ))
            ) : (
              <p>No products currently available</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Product;