import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Product.css';

// Product data with initial reviews
const products = [
  { 
    id: 1,
    name: 'Fresh Tomatoes',
    farmer: 'Ramesh Kumar',
    phone: '9876543210',
    city: 'Delhi',
    price: 40,
    unit: 'kg',
    rating: 4.5,
    distance: 10,
    organic: true,
    category: 'vegetables',
    image: '🍅',
    verified: true,
    description: 'Farm-fresh tomatoes, harvested just yesterday. Perfect for salads, curries, and sauces.',
    stock: 50,
    sold: 120,
    reviews: [
      { id: 101, user: 'Rahul Sharma', rating: 5, comment: 'Very fresh and tasty!', date: '2026-02-15' },
      { id: 102, user: 'Anita Devi', rating: 4, comment: 'Good quality, but a few were overripe.', date: '2026-02-10' },
      { id: 103, user: 'Suresh Patel', rating: 5, comment: 'Excellent tomatoes, will order again.', date: '2026-02-05' },
    ]
  },
  { 
    id: 2,
    name: 'Organic Apples',
    farmer: 'Priya Sharma',
    phone: '9812345678',
    city: 'Shimla',
    price: 120,
    unit: 'kg',
    rating: 5,
    distance: 15,
    organic: true,
    category: 'fruits',
    image: '🍎',
    verified: true,
    description: 'Crisp, juicy apples from the orchards of Shimla. 100% organic, no pesticides.',
    stock: 30,
    sold: 80,
    reviews: [
      { id: 201, user: 'Meera Joshi', rating: 5, comment: 'Best apples I ever had!', date: '2026-02-18' },
      { id: 202, user: 'Ajay Singh', rating: 5, comment: 'Sweet and crunchy. Loved them.', date: '2026-02-12' },
    ]
  },
  { 
    id: 3,
    name: 'Basmati Rice',
    farmer: 'Gurpreet Singh',
    phone: '9876501234',
    city: 'Amritsar',
    price: 80,
    unit: 'kg',
    rating: 4,
    distance: 25,
    organic: false,
    category: 'grains',
    image: '🌾',
    verified: false,
    description: 'Premium aged basmati rice, long grain and aromatic. Grown in the foothills of Punjab.',
    stock: 200,
    sold: 350,
    reviews: [
      { id: 301, user: 'Kavita Rani', rating: 4, comment: 'Good rice, but delivery took time.', date: '2026-01-28' },
      { id: 302, user: 'Rajesh Kumar', rating: 4, comment: 'Aromatic and long grains. Satisfied.', date: '2026-01-20' },
    ]
  },
  { 
    id: 4,
    name: 'Cow Milk',
    farmer: 'Dairy Fresh',
    phone: '9823456789',
    city: 'Pune',
    price: 50,
    unit: 'litre',
    rating: 4.8,
    distance: 5,
    organic: true,
    category: 'dairy',
    image: '🥛',
    verified: true,
    description: 'Fresh cow milk, delivered daily. No preservatives, pure and creamy.',
    stock: 100,
    sold: 250,
    reviews: [
      { id: 401, user: 'Sunita Gaikwad', rating: 5, comment: 'Very fresh and creamy. Daily delivery is great.', date: '2026-02-14' },
    ]
  },
  { 
    id: 5,
    name: 'Potatoes',
    farmer: 'Hari Ram',
    phone: '9812398765',
    city: 'Agra',
    price: 30,
    unit: 'kg',
    rating: 4.2,
    distance: 8,
    organic: false,
    category: 'vegetables',
    image: '🥔',
    verified: false,
    description: 'High-quality potatoes, ideal for all cooking purposes. Freshly harvested.',
    stock: 150,
    sold: 180,
    reviews: [
      { id: 501, user: 'Vikram Yadav', rating: 4, comment: 'Good potatoes, no rot.', date: '2026-02-01' },
      { id: 502, user: 'Pooja Mishra', rating: 4, comment: 'Satisfied with quality.', date: '2026-01-25' },
    ]
  },
  { 
    id: 6,
    name: 'Organic Wheat',
    farmer: 'Green Fields',
    phone: '9876512345',
    city: 'Indore',
    price: 45,
    unit: 'kg',
    rating: 4.6,
    distance: 12,
    organic: true,
    category: 'grains',
    image: '🌾',
    verified: true,
    description: 'Certified organic wheat, stone-ground for maximum nutrition. Perfect for rotis and bread.',
    stock: 80,
    sold: 110,
    reviews: []
  },
  { 
    id: 7,
    name: 'Hybrid Seeds',
    farmer: 'AgriSeed Co.',
    phone: '9834567890',
    city: 'Nagpur',
    price: 250,
    unit: 'pack',
    rating: 4.3,
    distance: 30,
    organic: false,
    category: 'seeds',
    image: '🌱',
    verified: true,
    description: 'High-yield hybrid vegetable seeds suitable for all seasons. Pack contains 500g.',
    stock: 40,
    sold: 65,
    reviews: [
      { id: 701, user: 'Dinesh Patil', rating: 5, comment: 'Germination rate was excellent!', date: '2026-01-30' },
    ]
  },
  { 
    id: 8,
    name: 'Organic Fertilizer',
    farmer: 'EcoGrow',
    phone: '9845678901',
    city: 'Lucknow',
    price: 400,
    unit: 'bag',
    rating: 4.7,
    distance: 20,
    organic: true,
    category: 'fertilizers',
    image: '🧪',
    verified: false,
    description: '100% organic compost enriched with neem and earthworms. Boosts soil fertility naturally.',
    stock: 25,
    sold: 40,
    reviews: []
  },
  { 
    id: 9,
    name: 'Fresh Carrots',
    farmer: 'Veggie Farms',
    phone: '9856789012',
    city: 'Nashik',
    price: 35,
    unit: 'kg',
    rating: 4.4,
    distance: 7,
    organic: true,
    category: 'vegetables',
    image: '🥕',
    verified: true,
    description: 'Crunchy, sweet carrots grown in the rich soil of Nashik. Excellent for salads and juices.',
    stock: 60,
    sold: 90,
    reviews: [
      { id: 901, user: 'Asha Sharma', rating: 5, comment: 'Very sweet and fresh!', date: '2026-02-08' },
      { id: 902, user: 'Manoj Gupta', rating: 4, comment: 'Good quality carrots.', date: '2026-02-01' },
    ]
  },
  { 
    id: 10,
    name: 'Free Range Eggs',
    farmer: 'Happy Hens',
    phone: '9867890123',
    city: 'Bengaluru',
    price: 90,
    unit: 'dozen',
    rating: 4.9,
    distance: 12,
    organic: true,
    category: 'dairy',
    image: '🥚',
    verified: true,
    description: 'Free-range eggs from happy, healthy hens. Rich in omega-3 and deep yellow yolk.',
    stock: 45,
    sold: 130,
    reviews: [
      { id: 1001, user: 'Neha Kapoor', rating: 5, comment: 'Best eggs in town!', date: '2026-02-20' },
      { id: 1002, user: 'Arjun Reddy', rating: 5, comment: 'Farm fresh, exactly as described.', date: '2026-02-15' },
    ]
  }
];


const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });

  useEffect(() => {
    const found = products.find(p => p.id === parseInt(id));
    setProduct(found);
    if (found) {
      setReviews(found.reviews || []);
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return <div className="product-not-found">Product not found</div>;
  }

  // Mock additional images (using same emoji for demo)
  const images = [product.image, product.image, product.image];

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (val > 0 && val <= product.stock) setQuantity(val);
  };

  const addToCart = () => {
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const buyNow = () => {
    alert('Proceed to checkout');
  };

  const contactSeller = () => {
    alert(`Call seller at: ${product.phone}`);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) {
      alert('Please enter your name and comment.');
      return;
    }

    const review = {
      id: Date.now(), // simple unique id
      user: newReview.name,
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    };

    setReviews([review, ...reviews]); // add new review at top
    setNewReview({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  // Calculate average rating from reviews
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : product.rating;

  return (
    <div className="product-page">
      <div className="product-page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <Link to="/marketplace">Marketplace</Link> &gt; <span>{product.name}</span>
        </div>

        <div className="product-main">
          {/* Left: Image Gallery */}
          <div className="product-gallery">
            <div className="main-image">
              <span className="image-emoji">{images[activeImage]}</span>
            </div>
            <div className="thumbnail-list">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail ${idx === activeImage ? 'active' : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <span className="thumbnail-emoji">{img}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Middle: Product Details */}
          <div className="product-info">
            <h1 className="product-title">{product.name}</h1>
            <div className="product-rating">
              <span className="rating-stars">⭐ {avgRating}</span>
              <span className="rating-count">({product.sold} sold)</span>
              {product.organic && <span className="organic-badge-large">Organic</span>}
            </div>

            <div className="product-price-section">
              <span className="price-currency">₹</span>
              <span className="price-amount">{product.price}</span>
              <span className="price-unit">/{product.unit}</span>
            </div>

            <div className="product-seller">
              <div className="seller-row">
                <span className="seller-label">Sold by:</span>
                <span className="seller-name">
                  {product.farmer}
                  {product.verified && <span className="verified-badge-large" title="Verified Farmer">✓</span>}
                </span>
              </div>
              <div className="seller-contact">
                <span className="seller-phone">📞 {product.phone}</span>
                <span className="seller-location">📍 {product.city} • {product.distance} km away</span>
              </div>
            </div>

            <div className="product-stock">
              {product.stock > 0 ? (
                <span className="in-stock">In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-of-stock">Out of Stock</span>
              )}
            </div>

            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>

            {/* Quantity and Actions */}
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={handleQuantityChange}
                />
              </div>
              <div className="action-buttons">
                <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
                <button className="buy-now-btn" onClick={buyNow}>Buy Now</button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="delivery-info">
              <p>🚚 Free delivery on orders above ₹500</p>
              <p>⏱️ Usually delivers in 2-3 days</p>
            </div>
          </div>

          {/* Right: Seller Card / Offers */}
          <div className="product-sidebar">
            <div className="seller-card">
              <h4>Seller Information</h4>
              <p><strong>{product.farmer}</strong> {product.verified && '✅ Verified'}</p>
              <p>📍 {product.city}</p>
              <p>⭐ {product.rating} Seller Rating</p>
              <p>📞 {product.phone}</p>
              <p>📦 Ships within 24 hours</p>
              <button className="contact-seller" onClick={contactSeller}>Contact Seller</button>
            </div>

            <div className="offer-card">
              <h4>Available Offers</h4>
              <ul>
                <li>🎉 5% off on first purchase</li>
                <li>💳 No cost EMI on orders above ₹1000</li>
                <li>🌾 Special discount for farmers (verify at checkout)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Customer Reviews</h2>
          
          {/* Review Summary */}
          <div className="review-summary">
            <div className="average-rating">
              <span className="big-rating">{avgRating}</span>
              <span className="stars">⭐</span>
              <span className="total-reviews">Based on {totalReviews} reviews</span>
            </div>
            <button className="write-review-btn" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          </div>

          {/* Write Review Form */}
          {showReviewForm && (
            <div className="review-form">
              <h3>Write Your Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label>Your Name</label>
                  <input
                    type="text"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= newReview.rating ? 'selected' : ''}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Your Review</label>
                  <textarea
                    rows="4"
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    placeholder="Tell others what you think about this product..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="submit-review-btn">Submit Review</button>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="reviews-list">
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="reviewer-name">{review.user}</span>
                    <span className="review-rating">{'⭐'.repeat(review.rating)}</span>
                    <span className="review-date">{new Date(review.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
            )}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map(rel => (
                <Link to={`/product/${rel.id}`} key={rel.id} className="related-card">
                  <div className="related-image">{rel.image}</div>
                  <div className="related-info">
                    <h4>{rel.name}</h4>
                    <p>₹{rel.price}/{rel.unit}</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;