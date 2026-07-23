import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Product.css';

const Product = () => {
  const { id } = useParams();
<<<<<<< HEAD
  const navigate = useNavigate();
  const { addItem } = useCart();
=======
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6

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

  const [farmerRatingStats, setFarmerRatingStats] = useState({ avg: 0, count: 0, ratings: [] });
  const [showFarmerRatingForm, setShowFarmerRatingForm] = useState(false);
  const [myFarmerRating, setMyFarmerRating] = useState({ rating: 5, comment: '' });
  const [submittingFarmerRating, setSubmittingFarmerRating] = useState(false);
  const [farmerRatingError, setFarmerRatingError] = useState('');

  const token = localStorage.getItem('token');
  const currentUserName = localStorage.getItem('userName');
  const userType = localStorage.getItem('userType');
  const currentUserId = localStorage.getItem('userId');

  const checkWishlist = async () => {
    if (!token || userType !== 'customer') return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed');
        setInWishlist(false);
      } else {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/product/${id}`);
      if (!res.ok) throw new Error('Failed to load reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFarmerRatings = async (farmerId) => {
    if (!farmerId) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmers/${farmerId}/ratings`);
      if (!res.ok) throw new Error('Failed to load farmer ratings');
      const data = await res.json();
      setFarmerRatingStats(data);

      if (currentUserId) {
        const mine = (data.ratings || []).find(
          (r) => r.user && r.user._id === currentUserId
        );
        if (mine) {
          setMyFarmerRating({ rating: mine.rating, comment: mine.comment || '' });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFarmerRatingSubmit = async (e) => {
    e.preventDefault();
    setFarmerRatingError('');

    if (!token) {
      setFarmerRatingError('Please login to rate this farmer.');
      return;
    }

    if (userType === 'farmer' && product?.farmer?._id === currentUserId) {
      setFarmerRatingError("You can't rate yourself.");
      return;
    }

    try {
      setSubmittingFarmerRating(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/farmers/${product.farmer._id}/ratings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            rating: Number(myFarmerRating.rating),
            comment: myFarmerRating.comment,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit rating');

      await fetchFarmerRatings(product.farmer._id);
      await fetchProduct();
      setShowFarmerRatingForm(false);
    } catch (err) {
      setFarmerRatingError(err.message);
    } finally {
      setSubmittingFarmerRating(false);
    }
  };

  const fetchProduct = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      const data = await res.json();
      setProduct(data);

      if (data?.farmer?._id) {
        fetchFarmerRatings(data.farmer._id);
      }

      const res2 = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
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
<<<<<<< HEAD
    fetchProduct();
    fetchReviews();
    checkWishlist();
=======
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
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

<<<<<<< HEAD
  const productImages = (product.images || []).map((url) => ({ url, type: 'image' }));
  const productVideos = (product.videos || []).map((url) => ({ url, type: 'video' }));
  const media = [...productImages, ...productVideos];
  const activeMedia = media[activeImage];
=======
  // ✅ FIXED (no fake data)
  const images = product.images || [];
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product.stock) setQuantity(val);
  };

<<<<<<< HEAD
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
        `${import.meta.env.VITE_API_URL}/api/reviews/product/${id}`,
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
=======
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
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6

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
<<<<<<< HEAD
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
=======
              <img
                src={images[activeImage] || "https://via.placeholder.com/200"}
                alt={product.name}
              />
            </div>

            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <img
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
                  key={idx}
                  src={img}
                  alt=""
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
<<<<<<< HEAD
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
=======
                />
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
              ))}
            </div>
          </div>

          {/* MIDDLE */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating">
              <span className="rating-stars">⭐ {avgRating}</span>
<<<<<<< HEAD
              <span className="rating-count">({totalReviews} reviews)</span>
=======
              <span className="rating-count">({product.numReviews} reviews)</span>
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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
<<<<<<< HEAD
                </span>
                <span className="seller-farmer-rating" style={{
                  marginLeft: '0.75rem',
                  background: '#fff8e1',
                  color: '#b88200',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                }}>
                  ⭐ {Number(farmerRatingStats.avg || product.farmer?.farmerAvgRating || 0).toFixed(1)}
                  {' '}
                  <small style={{ fontWeight: 400 }}>
                    Farmer · {farmerRatingStats.count || product.farmer?.farmerRatingCount || 0} ratings
                  </small>
=======
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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
<<<<<<< HEAD
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
=======
                <button className="add-to-cart-btn">Add to Cart</button>
                <button className="buy-now-btn">Buy Now</button>
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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
<<<<<<< HEAD
              <p><strong>{product.farmer?.fullName}</strong>
                {product.farmer?.verification?.status === 'approved' && (
                  <span style={{ marginLeft: 6, color: '#2e7d32' }}>✓</span>
                )}
              </p>
              <p>📍 {product.farmer?.address}</p>
              <p style={{
                background: '#fff8e1',
                padding: '0.5rem 0.7rem',
                borderRadius: 8,
                color: '#b88200',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}>
                ⭐ Farmer Rating: {Number(farmerRatingStats.avg || product.farmer?.farmerAvgRating || 0).toFixed(1)}
                {' '}
                <small style={{ fontWeight: 400, color: '#888' }}>
                  ({farmerRatingStats.count || product.farmer?.farmerRatingCount || 0} ratings)
                </small>
              </p>
              <p>📞 {product.farmer?.mobile}</p>
              <p>📦 Ships within 24 hours</p>

              {/* Rate this Farmer */}
              {product.farmer?._id && product.farmer._id !== currentUserId && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                  {!showFarmerRatingForm ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!token) {
                          alert('Please login to rate this farmer.');
                          navigate('/login');
                          return;
                        }
                        setShowFarmerRatingForm(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem',
                        background: '#2e7d32',
                        color: 'white',
                        border: 'none',
                        borderRadius: 8,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      ⭐ Rate this Farmer
                    </button>
                  ) : (
                    <form onSubmit={handleFarmerRatingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', color: '#444' }}>Your Rating</label>
                      <div style={{ display: 'flex', gap: 4, fontSize: '1.6rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <span
                            key={s}
                            onClick={() => setMyFarmerRating({ ...myFarmerRating, rating: s })}
                            style={{
                              color: s <= Number(myFarmerRating.rating) ? '#f5a623' : '#ddd',
                              userSelect: 'none',
                            }}
                          >
                            ★
                          </span>
                        ))}
                      </div>

                      <textarea
                        rows="2"
                        placeholder="Share a comment about this farmer (optional)"
                        value={myFarmerRating.comment}
                        onChange={(e) => setMyFarmerRating({ ...myFarmerRating, comment: e.target.value })}
                        style={{
                          padding: '0.5rem',
                          borderRadius: 8,
                          border: '1px solid #ddd',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                        }}
                      />

                      {farmerRatingError && (
                        <p style={{ color: 'crimson', fontSize: '0.85rem', margin: 0 }}>
                          {farmerRatingError}
                        </p>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="submit"
                          disabled={submittingFarmerRating}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: '#2e7d32',
                            color: 'white',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer',
                            fontWeight: 600,
                          }}
                        >
                          {submittingFarmerRating ? 'Saving...' : 'Submit'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowFarmerRatingForm(false);
                            setFarmerRatingError('');
                          }}
                          style={{
                            flex: 1,
                            padding: '0.5rem',
                            background: 'white',
                            color: '#666',
                            border: '1px solid #ddd',
                            borderRadius: 8,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Recent farmer ratings */}
              {farmerRatingStats.ratings && farmerRatingStats.ratings.length > 0 && (
                <div style={{ marginTop: '0.75rem', borderTop: '1px solid #eee', paddingTop: '0.75rem' }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', color: '#1b5e20' }}>What customers say</h5>
                  <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {farmerRatingStats.ratings.slice(0, 4).map((r) => (
                      <div key={r._id} style={{ background: '#fafafa', padding: '0.5rem', borderRadius: 6, fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <strong style={{ color: '#333' }}>{r.user?.fullName || 'Anonymous'}</strong>
                          <span style={{ color: '#f5a623' }}>{'⭐'.repeat(r.rating)}</span>
                        </div>
                        {r.comment && (
                          <p style={{ margin: '0.25rem 0 0 0', color: '#555' }}>{r.comment}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
=======
              <p><strong>{product.farmer?.fullName}</strong></p>
              <p>📍 {product.farmer?.address}</p>
              <p>⭐ {product.rating}</p>
              <p>📞 {product.farmer?.mobile}</p>
              <p>📦 Ships within 24 hours</p>
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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
<<<<<<< HEAD
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
=======
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
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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

<<<<<<< HEAD
                {reviewError && (
                  <p style={{ color: 'crimson' }}>{reviewError}</p>
                )}

                <button
                  type="submit"
                  className="submit-review-btn"
                  disabled={submittingReview || !token}
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
=======
                <button type="submit" className="submit-review-btn">
                  Submit Review
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
                </button>

              </form>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map((r) => (
<<<<<<< HEAD
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
=======
                <div key={r.id} className="review-card">
                  <p><strong>{r.user}</strong></p>
>>>>>>> 19932e9735570b197d18b2e47e5846678e7e99c6
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