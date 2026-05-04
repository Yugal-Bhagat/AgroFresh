import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Product.css';

const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [inWishlist, setInWishlist] = useState(false);

  const token = localStorage.getItem('token');
  const currentUserName = localStorage.getItem('userName');
  const userType = localStorage.getItem('userType');

  const checkWishlist = async () => {
    if (!token || userType !== 'customer') return;
    try {
      const res = await fetch('http://localhost:5000/api/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const has = (data.products || []).some((p) => p && p._id === id);
      setInWishlist(has);
    } catch {
      /* ignore */
    }
  };

  const toggleWishlist = async () => {
    if (!token) {
      alert('Please login to use wishlist.');
      navigate('/login');
      return;
    }
    if (userType === 'farmer') {
      alert("You're logged in as a Farmer. Wishlist is for customers — please login with a Customer account.");
      return;
    }
    try {
      if (inWishlist) {
        const res = await fetch(`http://localhost:5000/api/wishlist/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed');
        setInWishlist(false);
      } else {
        const res = await fetch('http://localhost:5000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productId: id }),
        });
        if (!res.ok) throw new Error('Failed');
        setInWishlist(true);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/product/${id}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      const res2 = await fetch(`http://localhost:5000/api/products`);
      const allProducts = await res2.json();
      setRelatedProducts(
        allProducts.filter(
          (p) => p.category === data.category && p._id !== data._id,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    checkWishlist();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  const productImages = (product.images || []).map((url) => ({ url, type: 'image' }));
  const productVideos = (product.videos || []).map((url) => ({ url, type: 'video' }));
  const media = [...productImages, ...productVideos];
  const activeMedia = media[activeImage];

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product.stock) setQuantity(val);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');

    if (!token) {
      setReviewError('Please login to write a review.');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await fetch(
        `http://localhost:5000/api/reviews/product/${id}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(newReview.rating),
            comment: newReview.comment,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      await fetchReviews();
      await fetchProduct();
      setNewReview({ rating: 5, comment: '' });
      setShowReviewForm(false);
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const totalReviews = product.numReviews || reviews.length;
  const avgRating =
    product.rating && product.rating > 0
      ? Number(product.rating).toFixed(1)
      : reviews.length > 0
        ? (
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          ).toFixed(1)
        : '0.0';

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
              {activeMedia?.type === 'video' ? (
                <video
                  src={activeMedia.url}
                  controls
                  style={{ width: '100%', maxHeight: '400px', objectFit: 'contain', background: '#000' }}
                />
              ) : (
                <img
                  src={activeMedia?.url || "https://via.placeholder.com/200"}
                  alt={product.name}
                />
              )}
            </div>

            <div className="thumbnail-list">
              {media.map((m, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                  style={{ position: 'relative', cursor: 'pointer' }}
                >
                  {m.type === 'video' ? (
                    <>
                      <video src={m.url} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <span style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '1.2rem',
                        textShadow: '0 0 4px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                      }}>▶</span>
                    </>
                  ) : (
                    <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  )}
                </div>
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
                <button
                  className="add-to-cart-btn"
                  disabled={product.stock < 1}
                  onClick={() => {
                    const userType = localStorage.getItem("userType");
                    if (userType === "farmer") {
                      alert("You're logged in as a Farmer. To buy products, please create or login with a Customer account.");
                      return;
                    }
                    addItem(product, quantity);
                    alert("Added to cart");
                  }}
                >
                  {product.stock < 1 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  className="buy-now-btn"
                  disabled={product.stock < 1}
                  onClick={() => {
                    const ut = localStorage.getItem("userType");
                    if (ut === "farmer") {
                      alert("You're logged in as a Farmer. To buy products, please create or login with a Customer account.");
                      return;
                    }
                    addItem(product, quantity);
                    if (!localStorage.getItem("token")) {
                      navigate("/login", { state: { from: { pathname: "/checkout" } } });
                    } else {
                      navigate("/checkout");
                    }
                  }}
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  onClick={toggleWishlist}
                  title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  style={{
                    background: 'transparent',
                    border: '2px solid ' + (inWishlist ? '#d32f2f' : '#c8e6c9'),
                    borderRadius: '50%',
                    width: 44,
                    height: 44,
                    cursor: 'pointer',
                    fontSize: '1.4rem',
                    flexShrink: 0,
                  }}
                >
                  {inWishlist ? '❤️' : '🤍'}
                </button>
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
              <p>
                ⭐ {Number(product.farmer?.rating || 0).toFixed(1)}
                {' '}
                <small>({product.farmer?.totalReviews || 0} reviews)</small>
              </p>
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
              {!token && (
                <p style={{ color: 'crimson' }}>
                  You need to login to post a review.
                </p>
              )}
              {token && currentUserName && (
                <p style={{ color: '#555', marginBottom: '0.5rem' }}>
                  Posting as <strong>{currentUserName}</strong>
                </p>
              )}
              <form onSubmit={handleReviewSubmit}>

                <div className="form-group">
                  <label>Your Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) =>
                      setNewReview({ ...newReview, rating: e.target.value })
                    }
                  >
                    <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                    <option value="4">⭐⭐⭐⭐ (4)</option>
                    <option value="3">⭐⭐⭐ (3)</option>
                    <option value="2">⭐⭐ (2)</option>
                    <option value="1">⭐ (1)</option>
                  </select>
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

                {reviewError && (
                  <p style={{ color: 'crimson' }}>{reviewError}</p>
                )}

                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={submittingReview || !token}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>

              </form>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r._id} className="review-card">
                  <p>
                    <strong>{r.user?.fullName || 'Anonymous'}</strong>
                    {' '}
                    <span style={{ color: '#f5a623' }}>
                      {'⭐'.repeat(r.rating)}
                    </span>
                    {' '}
                    <small style={{ color: '#888' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                  </p>
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