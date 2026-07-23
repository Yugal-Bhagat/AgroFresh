import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showVerificationModal, setShowVerificationModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [verificationForm, setVerificationForm] = useState({
        farmName: '',
        farmLocation: '',
        farmSize: '',
        cropTypes: [],
        bankDetails: {
            accountHolderName: '',
            accountNumber: '',
            ifscCode: ''
        }
    });
    const [isEditing, setIsEditing] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        price: '',
        stock: '',
        quantityUnit: 'kg',
        category: 'vegetables',
        description: '',
    });
    const [editNewImages, setEditNewImages] = useState([]);
    const [editNewVideos, setEditNewVideos] = useState([]);
    const [editRemoveImages, setEditRemoveImages] = useState([]);
    const [editRemoveVideos, setEditRemoveVideos] = useState([]);
    const [editSubmitting, setEditSubmitting] = useState(false);
    const [editError, setEditError] = useState('');
    const navigate = useNavigate();

    // State for dynamic data
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalEarnings: 0,
        averageRating: 0,
        totalCustomers: 0,
        recentOrders: [],
        topProducts: []
    });

    const [farmerProfile, setFarmerProfile] = useState({
        name: '',
        farmName: '',
        email: '',
        phone: '',
        address: '',
        joinDate: '',
        avatar: '👨‍🌾',
        rating: 0
    });

    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [earnings, setEarnings] = useState({
        totalEarnings: 0,
        monthlyData: [],
        topEarningProducts: []
    });

    const [ratings, setRatings] = useState({
        averageRating: 0,
        totalReviews: 0,
        ratingBreakdown: {},
        recentReviews: []
    });

    const [verificationStatus, setVerificationStatus] = useState({
        status: 'not_applied',
        isSellingEnabled: false,
        message: '',
        appliedAt: null,
        approvedAt: null
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
        fetchFarmerProfile();
        fetchVerificationStatus();
    }, []);

    useEffect(() => {
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'earnings') fetchEarnings();
        if (activeTab === 'profile') fetchRatings();
    }, [activeTab]);

    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/dashboard`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setDashboardData(data);
            }
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        }
    };

    const fetchFarmerProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const user = await res.json();
                setFarmerProfile({
                    name: user.fullName,
                    farmName: user.farmerDetails?.farmName || '',
                    email: user.email,
                    phone: user.mobile,
                    address: user.address,
                    joinDate: new Date(user.createdAt).toLocaleDateString(),
                    avatar: '👨‍🌾',
                    rating: user.averageRating || 0
                });
            }
        } catch (err) {
            console.error('Profile fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/products`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data);
            }
        } catch (err) {
            console.error('Products fetch error:', err);
        }
    };

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Orders fetch error:', err);
        }
    };

    const fetchEarnings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/earnings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setEarnings(data);
            }
        } catch (err) {
            console.error('Earnings fetch error:', err);
        }
    };

    const fetchRatings = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/ratings`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setRatings(data);
            }
        } catch (err) {
            console.error('Ratings fetch error:', err);
        }
    };

    const fetchVerificationStatus = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/verification-status`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setVerificationStatus(data);
            }
        } catch (err) {
            console.error('Verification status fetch error:', err);
        }
    };

    const handleVerificationSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/farmer/apply-verification`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(verificationForm)
            });

            if (res.ok) {
                setSuccessMessage('Verification application submitted successfully!');
                setShowVerificationModal(false);
                fetchVerificationStatus();
                setTimeout(() => setSuccessMessage(''), 3000);
            } else {
                setError('Failed to submit application');
            }
        } catch (err) {
            console.error('Verification submit error:', err);
            setError('Failed to submit application');
        }
    };

    const handleCropTypeChange = (cropType) => {
        setVerificationForm(prev => ({
            ...prev,
            cropTypes: prev.cropTypes.includes(cropType)
                ? prev.cropTypes.filter(type => type !== cropType)
                : [...prev.cropTypes, cropType]
        }));
    };

    const getStatusBadge = (status) => {
        const badges = {
            delivered: 'status-delivered',
            shipped: 'status-shipped',
            processing: 'status-processing',
            cancelled: 'status-cancelled'
        };
        return badges[status] || 'status-processing';
    };

    const getPaymentBadge = (status) => {
        const badges = {
            paid: 'payment-paid',
            pending: 'payment-pending',
            refunded: 'payment-refunded'
        };
        return badges[status] || 'payment-pending';
    };

    const handleAddProduct = (e) => {
        e.preventDefault();
        // Add product logic here
        alert('Product added successfully!');
        setShowAddProduct(false);
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.message || 'Failed to delete product');
            }
            setProducts((prev) => prev.filter((p) => p.productId !== id));
            setSuccessMessage('Product deleted successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message);
        }
    };

    const openEditProduct = (product) => {
        setEditingProduct(product);
        setEditForm({
            name: product.name || '',
            price: product.price || '',
            stock: product.stock || '',
            quantityUnit: product.quantityUnit || 'kg',
            category: product.category || 'vegetables',
            description: product.description || '',
        });
        setEditNewImages([]);
        setEditNewVideos([]);
        setEditRemoveImages([]);
        setEditRemoveVideos([]);
        setEditError('');
    };

    const closeEditProduct = () => {
        setEditingProduct(null);
        setEditNewImages([]);
        setEditNewVideos([]);
        setEditRemoveImages([]);
        setEditRemoveVideos([]);
        setEditError('');
    };

    const toggleRemoveExistingImage = (url) => {
        setEditRemoveImages((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const toggleRemoveExistingVideo = (url) => {
        setEditRemoveVideos((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;
        setEditError('');
        setEditSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const fd = new FormData();
            Object.entries(editForm).forEach(([k, v]) => fd.append(k, v));
            editNewImages.forEach((file) => fd.append('images', file));
            editNewVideos.forEach((file) => fd.append('videos', file));
            if (editRemoveImages.length) fd.append('removeImages', JSON.stringify(editRemoveImages));
            if (editRemoveVideos.length) fd.append('removeVideos', JSON.stringify(editRemoveVideos));

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${editingProduct.productId}`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update product');

            await fetchProducts();
            closeEditProduct();
            setSuccessMessage('Product updated successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setEditError(err.message);
        } finally {
            setEditSubmitting(false);
        }
    };

    return (
        <div className="farmer-dashboard">
            <div className="dashboard-container">

                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <div className="avatar">{farmerProfile.avatar}</div>
                        <h3>{farmerProfile.name}</h3>
                        <p>{farmerProfile.farmName}</p>
                        <div className="farmer-rating">
                            <span>⭐ {farmerProfile.rating}</span>
                            <span>{verificationStatus.isSellingEnabled ? 'Seller Verified ✓' : 'Not Verified'}</span>
                        </div>
                    </div>

                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <span className="nav-icon">📊</span>
                            <span>Overview</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <span className="nav-icon">🌾</span>
                            <span>My Products</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <span className="nav-icon">📦</span>
                            <span>Orders Received</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'earnings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('earnings')}
                        >
                            <span className="nav-icon">💰</span>
                            <span>Earnings</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <span className="nav-icon">👤</span>
                            <span>Farm Profile</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'verification' ? 'active' : ''}`}
                            onClick={() => setActiveTab('verification')}
                        >
                            <span className="nav-icon">✅</span>
                            <span>Seller Verification</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }}>
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="dashboard-main">

                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <div className="tab-content fade-in">
                            <div className="welcome-banner">
                                <div className="welcome-text">
                                    <h2>Welcome back, {farmerProfile.name.split(' ')[0]}! 🌾</h2>
                                    <p>Here's what's happening with your farm today</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">🌾</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{dashboardData.totalProducts}</span>
                                        <span className="stat-label">Total Products</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📦</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{dashboardData.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">₹{dashboardData.totalEarnings.toLocaleString()}</span>
                                        <span className="stat-label">Total Earnings</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{dashboardData.averageRating}</span>
                                        <span className="stat-label">Rating</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Orders */}
                            <div className="recent-orders">
                                <div className="section-header">
                                    <h3>Recent Orders</h3>
                                    <button className="view-all" onClick={() => setActiveTab('orders')}>View All →</button>
                                </div>
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th></tr>
                                        </thead>
                                        <tbody>
                                            {dashboardData.recentOrders.map((order, index) => (
                                                <tr key={index}>
                                                    <td>#{order._id.slice(-6)}</td>
                                                    <td>{order.customer.fullName}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td>{order.totalAmount}</td>
                                                    <td>₹{order.totalAmount}</td>
                                                    <td><span className={`status-badge ${getStatusBadge(order.orderStatus)}`}>{order.orderStatus}</span></td>
                                                    <td><span className={`payment-badge ${getPaymentBadge(order.paymentStatus)}`}>{order.paymentStatus}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-grid">
                                    <Link to="/add-product" className="action-card">
                                        <span>➕</span>
                                        <span>Add Product</span>
                                    </Link>
                                    <button className="action-card" onClick={() => setActiveTab('products')}>
                                        <span>📦</span>
                                        <span>Manage Stock</span>
                                    </button>
                                    <button className="action-card" onClick={() => setActiveTab('earnings')}>
                                        <span>💰</span>
                                        <span>Withdraw Earnings</span>
                                    </button>
                                    <Link to="/marketplace" className="action-card">
                                        <span>🛒</span>
                                        <span>View Store</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === 'products' && (
                        <div className="tab-content fade-in">
                            <div className="products-header">
                                <h2>My Products</h2>
                                <Link to="/add-product" className="add-product-btn">
                                    + Add New Product
                                </Link>
                            </div>

                            {/* Add Product Modal */}
                            {showAddProduct && (
                                <div className="modal-overlay" onClick={() => setShowAddProduct(false)}>
                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                        <h3>Add New Product</h3>
                                        <form onSubmit={handleAddProduct}>
                                            <div className="form-group">
                                                <label>Product Name</label>
                                                <input type="text" required />
                                            </div>
                                            <div className="form-row">
                                                <div className="form-group">
                                                    <label>Price (₹)</label>
                                                    <input type="number" required />
                                                </div>
                                                <div className="form-group">
                                                    <label>Unit</label>
                                                    <select>
                                                        <option>kg</option>
                                                        <option>litre</option>
                                                        <option>dozen</option>
                                                        <option>pack</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Stock Quantity</label>
                                                <input type="number" required />
                                            </div>
                                            <div className="form-group">
                                                <label>Category</label>
                                                <select>
                                                    <option>vegetables</option>
                                                    <option>fruits</option>
                                                    <option>grains</option>
                                                    <option>dairy</option>
                                                    <option>seeds</option>
                                                    <option>fertilizers</option>
                                                </select>
                                            </div>
                                            <div className="modal-actions">
                                                <button type="submit" className="submit-btn">Add Product</button>
                                                <button type="button" className="cancel-btn" onClick={() => setShowAddProduct(false)}>Cancel</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            <div className="products-grid">
                                {products.length === 0 ? (
                                    <p style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center', gridColumn: '1 / -1' }}>
                                        You haven't added any products yet. Click "Add New Product" to get started.
                                    </p>
                                ) : products.map(product => (
                                    <div className="product-card" key={product.productId}>
                                        <Link
                                            to={`/product/${product.productId}`}
                                            className="product-image-link"
                                            style={{ display: 'block' }}
                                        >
                                            <div className="product-image" style={{ overflow: 'hidden' }}>
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '3rem' }}>🌾</span>
                                                )}
                                            </div>
                                        </Link>
                                        <div className="product-details">
                                            <Link to={`/product/${product.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <h4>{product.name}</h4>
                                            </Link>
                                            <p className="product-category">{product.category}</p>
                                            <p className="product-price">₹{product.price}/{product.quantityUnit}</p>
                                            <div className="product-stats">
                                                <span>Stock: {product.stock}</span>
                                                <span>Sold: {product.totalSold}</span>
                                                <span>Earnings: ₹{product.totalEarnings}</span>
                                            </div>
                                            <div className="product-rating">
                                                <span>⭐ {Number(product.rating || 0).toFixed(1)} ({product.reviews} reviews)</span>
                                            </div>
                                        </div>
                                        <div className="product-actions">
                                            <button className="edit-btn" onClick={() => openEditProduct(product)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.productId)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="tab-content fade-in">
                            <h2>Orders Received</h2>
                            {orders.length === 0 ? (
                                <p style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                                    No orders yet.
                                </p>
                            ) : (
                                <div className="order-cards">
                                    {orders.map(order => (
                                        <div className="order-card" key={order.orderId}>
                                            <div className="order-card-header">
                                                <div>
                                                    <strong>Order #{order.orderId.slice(-6).toUpperCase()}</strong>
                                                    <p className="order-date">
                                                        {new Date(order.orderDate).toLocaleString()}
                                                    </p>
                                                </div>
                                                <span className={`status-badge ${getStatusBadge(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>

                                            <div className="order-card-body">
                                                <div className="order-section">
                                                    <h4>👤 Customer</h4>
                                                    <p><strong>{order.customerName}</strong></p>
                                                    {order.customerPhone && (
                                                        <p>📞 {order.customerPhone}</p>
                                                    )}
                                                    {order.customerEmail && (
                                                        <p>✉️ {order.customerEmail}</p>
                                                    )}
                                                </div>

                                                <div className="order-section">
                                                    <h4>📦 Shipping Address</h4>
                                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                                        {order.shippingAddress || order.customerAddress || '—'}
                                                    </p>
                                                </div>

                                                <div className="order-section">
                                                    <h4>🛒 Items ({order.totalItems})</h4>
                                                    <ul className="order-items-list">
                                                        {order.productDetails.map((p, idx) => (
                                                            <li key={idx}>
                                                                {p.image && (
                                                                    <img src={p.image} alt={p.name} />
                                                                )}
                                                                <div>
                                                                    <strong>{p.name}</strong>
                                                                    <span>
                                                                        {p.quantity} {p.unit} × ₹{p.price} = ₹{(p.quantity * p.price).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="order-section">
                                                    <h4>💳 Payment</h4>
                                                    <p>
                                                        <strong>Method:</strong>{' '}
                                                        {order.paymentMethod === 'cod' ? '💵 Cash on Delivery' : '💳 Online'}
                                                    </p>
                                                    <p>
                                                        <strong>Status:</strong>{' '}
                                                        <span className={`payment-badge ${getPaymentBadge(order.paymentStatus)}`}>
                                                            {order.paymentStatus}
                                                        </span>
                                                    </p>
                                                    <p><strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}</p>
                                                </div>

                                                {order.notes && (
                                                    <div className="order-section">
                                                        <h4>📝 Notes</h4>
                                                        <p>{order.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="order-card-footer">
                                                {order.customerPhone && (
                                                    <a
                                                        href={`tel:${order.customerPhone}`}
                                                        className="contact-btn"
                                                    >
                                                        📞 Contact Customer
                                                    </a>
                                                )}
                                                <select
                                                    className="order-status-select"
                                                    value={order.orderStatus}
                                                    onChange={async (e) => {
                                                        try {
                                                            const token = localStorage.getItem('token');
                                                            const res = await fetch(
                                                                `${import.meta.env.VITE_API_URL}/api/orders/${order.orderId}/status`,
                                                                {
                                                                    method: 'PUT',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        Authorization: `Bearer ${token}`,
                                                                    },
                                                                    body: JSON.stringify({ status: e.target.value }),
                                                                },
                                                            );
                                                            if (!res.ok) {
                                                                const d = await res.json();
                                                                throw new Error(d.message || 'Failed');
                                                            }
                                                            fetchOrders();
                                                        } catch (err) {
                                                            alert(err.message);
                                                        }
                                                    }}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="processing">Processing</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Earnings Tab */}
                    {activeTab === 'earnings' && (
                        <div className="tab-content fade-in">
                            <h2>Earnings Overview</h2>
                            <div className="earnings-summary">
                                <div className="earnings-card">
                                    <h3>Total Earnings</h3>
                                    <p className="total-earnings">₹{earnings.totalEarnings.toLocaleString()}</p>
                                </div>
                                <div className="earnings-card">
                                    <h3>Pending Payout</h3>
                                    <p className="pending-earnings">₹{(earnings.totalEarnings * 0.15).toLocaleString()}</p>
                                </div>
                                <div className="earnings-card">
                                    <h3>Available Balance</h3>
                                    <p className="available-earnings">₹{(earnings.totalEarnings * 0.85).toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="chart-container">
                                <h3>Monthly Earnings</h3>
                                <div className="bar-chart">
                                    {earnings.monthlyData.map(item => (
                                        <div className="bar-item" key={item.month}>
                                            <div className="bar" style={{ height: `${(item.earnings / Math.max(...earnings.monthlyData.map(d => d.earnings))) * 100}%` }}>
                                                <span className="bar-value">₹{item.earnings}</span>
                                            </div>
                                            <span className="bar-label">{item.month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="top-earning-products">
                                <h3>Top Earning Products</h3>
                                <div className="products-earnings-list">
                                    {earnings.topEarningProducts.map((product, index) => (
                                        <div key={index} className="earnings-product-item">
                                            <span className="product-name">{product.name}</span>
                                            <span className="product-earnings">₹{product.earnings}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button className="withdraw-btn">Withdraw Earnings</button>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="tab-content fade-in">
                            <div className="profile-header">
                                <h2>Farm Profile</h2>
                                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Farmer Name</label>
                                    <input type="text" value={farmerProfile.name} disabled={!isEditing} onChange={(e) => setFarmerProfile({ ...farmerProfile, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Farm Name</label>
                                    <input type="text" value={farmerProfile.farmName} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={farmerProfile.email} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={farmerProfile.phone} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Farm Address</label>
                                    <textarea rows="3" value={farmerProfile.address} disabled={!isEditing}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Member Since</label>
                                    <input type="text" value={farmerProfile.joinDate} disabled />
                                </div>
                                {isEditing && (
                                    <button className="save-btn">Save Changes</button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Verification Tab */}
                    {activeTab === 'verification' && (
                        <div className="tab-content fade-in">
                            <h2>Seller Verification</h2>

                            {verificationStatus.status === 'approved' && (
                                <div className="verification-status approved">
                                    <div className="status-icon">✅</div>
                                    <div className="status-content">
                                        <h3>Congratulations! You are a Verified Seller</h3>
                                        <p>You can now sell your products on AgroFresh marketplace.</p>
                                        <p className="verification-date">Verified on: {new Date(verificationStatus.approvedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}

                            {verificationStatus.status === 'pending' && (
                                <div className="verification-status pending">
                                    <div className="status-icon">⏳</div>
                                    <div className="status-content">
                                        <h3>Verification Application Pending</h3>
                                        <p>Your application is being reviewed by our team. We'll notify you once it's processed.</p>
                                        <p className="application-date">Applied on: {new Date(verificationStatus.appliedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            )}

                            {verificationStatus.status === 'rejected' && (
                                <div className="verification-status rejected">
                                    <div className="status-icon">❌</div>
                                    <div className="status-content">
                                        <h3>Verification Application Rejected</h3>
                                        <p>{verificationStatus.message}</p>
                                        <button className="apply-btn" onClick={() => setShowVerificationModal(true)}>
                                            Apply Again
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(verificationStatus.status === 'not_applied' || verificationStatus.status === 'rejected') && (
                                <div className="apply-verification-section">
                                    <div className="apply-card">
                                        <h3>Become a Verified Seller</h3>
                                        <p>Get verified to start selling your fresh produce on AgroFresh marketplace.</p>
                                        <ul className="benefits-list">
                                            <li>✅ Direct access to thousands of customers</li>
                                            <li>✅ Higher selling prices</li>
                                            <li>✅ Secure payment processing</li>
                                            <li>✅ Marketing support</li>
                                            <li>✅ Quality assurance badge</li>
                                        </ul>
                                        <button className="apply-btn" onClick={() => setShowVerificationModal(true)}>
                                            Apply for Verification
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Schemes Tab */}
                    {activeTab === 'schemes' && (
                        <div className="tab-content fade-in">
                            <h2>Government Schemes for Farmers</h2>
                            <div className="schemes-grid">
                                <div className="scheme-card">
                                    <div className="scheme-icon">💰</div>
                                    <h3>PM Kisan Samman Nidhi</h3>
                                    <p>Financial benefit of ₹6,000 per year in three equal installments.</p>
                                    <button className="apply-btn">Apply Now</button>
                                </div>
                                <div className="scheme-card">
                                    <div className="scheme-icon">🌾</div>
                                    <h3>PM Fasal Bima Yojana</h3>
                                    <p>Comprehensive crop insurance against natural disasters and pests.</p>
                                    <button className="apply-btn">Apply Now</button>
                                </div>
                                <div className="scheme-card">
                                    <div className="scheme-icon">💳</div>
                                    <h3>Kisan Credit Card</h3>
                                    <p>Credit facility up to ₹2 lakh for crop cultivation and allied activities.</p>
                                    <button className="apply-btn">Apply Now</button>
                                </div>
                                <div className="scheme-card">
                                    <div className="scheme-icon">☀️</div>
                                    <h3>Solar Agri-Feeder Scheme</h3>
                                    <p>Daytime solar electricity for irrigation at subsidized rates.</p>
                                    <button className="apply-btn">Apply Now</button>
                                </div>
                            </div>
                        </div>
                    )}

                </main>
            </div>

            {/* Edit Product Modal */}
            {editingProduct && (
                <div className="modal-overlay" onClick={closeEditProduct}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 700 }}>
                        <div className="modal-header">
                            <h3>Edit Product</h3>
                            <button className="close-btn" onClick={closeEditProduct}>×</button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.price}
                                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Unit</label>
                                    <select
                                        value={editForm.quantityUnit}
                                        onChange={(e) => setEditForm({ ...editForm, quantityUnit: e.target.value })}
                                        required
                                    >
                                        {['kg', 'gram', 'litre', 'ml', 'dozen', 'piece', 'bunch', 'quintal'].map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Stock</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={editForm.stock}
                                        onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        value={editForm.category}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                        required
                                    >
                                        {['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Dairy', 'Spices', 'Herbs', 'Oilseeds', 'Other'].map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    rows="3"
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                />
                            </div>

                            {/* Existing Images */}
                            {editingProduct.images && editingProduct.images.length > 0 && (
                                <div className="form-group">
                                    <label>Existing Images (click × to remove)</label>
                                    <div className="upload-preview">
                                        {editingProduct.images.map((url) => {
                                            const removed = editRemoveImages.includes(url);
                                            return (
                                                <div
                                                    key={url}
                                                    className="preview-item"
                                                    style={{ opacity: removed ? 0.4 : 1, position: 'relative' }}
                                                >
                                                    <img src={url} alt="" className="preview-thumb" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                                                    <button
                                                        type="button"
                                                        className="preview-remove"
                                                        onClick={() => toggleRemoveExistingImage(url)}
                                                        title={removed ? 'Undo remove' : 'Remove'}
                                                    >
                                                        {removed ? '↺' : '×'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Add More Images (multiple allowed)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => {
                                        const incoming = Array.from(e.target.files);
                                        setEditNewImages((prev) => [...prev, ...incoming]);
                                        e.target.value = '';
                                    }}
                                />
                                {editNewImages.length > 0 && (
                                    <div className="upload-preview">
                                        {editNewImages.map((file, idx) => (
                                            <div key={idx} className="preview-item">
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt=""
                                                    className="preview-thumb"
                                                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="preview-remove"
                                                    onClick={() => setEditNewImages((prev) => prev.filter((_, i) => i !== idx))}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Existing Videos */}
                            {editingProduct.videos && editingProduct.videos.length > 0 && (
                                <div className="form-group">
                                    <label>Existing Videos (click × to remove)</label>
                                    <div className="upload-preview">
                                        {editingProduct.videos.map((url) => {
                                            const removed = editRemoveVideos.includes(url);
                                            return (
                                                <div
                                                    key={url}
                                                    className="preview-item"
                                                    style={{ opacity: removed ? 0.4 : 1, position: 'relative' }}
                                                >
                                                    <video src={url} muted className="preview-thumb" style={{ width: 80, height: 80, objectFit: 'cover' }} />
                                                    <button
                                                        type="button"
                                                        className="preview-remove"
                                                        onClick={() => toggleRemoveExistingVideo(url)}
                                                        title={removed ? 'Undo remove' : 'Remove'}
                                                    >
                                                        {removed ? '↺' : '×'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Add More Videos (multiple allowed)</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    multiple
                                    onChange={(e) => {
                                        const incoming = Array.from(e.target.files);
                                        setEditNewVideos((prev) => [...prev, ...incoming]);
                                        e.target.value = '';
                                    }}
                                />
                                {editNewVideos.length > 0 && (
                                    <div className="upload-preview">
                                        {editNewVideos.map((file, idx) => (
                                            <div key={idx} className="preview-item">
                                                <video
                                                    src={URL.createObjectURL(file)}
                                                    muted
                                                    className="preview-thumb"
                                                    style={{ width: 80, height: 80, objectFit: 'cover' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="preview-remove"
                                                    onClick={() => setEditNewVideos((prev) => prev.filter((_, i) => i !== idx))}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {editError && <p style={{ color: 'crimson' }}>{editError}</p>}

                            <div className="modal-actions">
                                <button type="submit" className="submit-btn" disabled={editSubmitting}>
                                    {editSubmitting ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button type="button" className="cancel-btn" onClick={closeEditProduct}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Apply for Seller Verification</h3>
                            <button className="close-btn" onClick={() => setShowVerificationModal(false)}>×</button>
                        </div>

                        <form onSubmit={handleVerificationSubmit} className="verification-form">
                            <div className="form-section">
                                <h4>Farm Information</h4>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Farm Name *</label>
                                        <input
                                            type="text"
                                            value={verificationForm.farmName}
                                            onChange={(e) => setVerificationForm({ ...verificationForm, farmName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Farm Location *</label>
                                        <input
                                            type="text"
                                            value={verificationForm.farmLocation}
                                            onChange={(e) => setVerificationForm({ ...verificationForm, farmLocation: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Farm Size (in acres) *</label>
                                    <input
                                        type="number"
                                        value={verificationForm.farmSize}
                                        onChange={(e) => setVerificationForm({ ...verificationForm, farmSize: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Crop Types *</label>
                                    <div className="crop-types">
                                        {['vegetables', 'fruits', 'grains', 'dairy', 'pulses', 'spices', 'other'].map(crop => (
                                            <label key={crop} className="crop-checkbox">
                                                <input
                                                    type="checkbox"
                                                    checked={verificationForm.cropTypes.includes(crop)}
                                                    onChange={() => handleCropTypeChange(crop)}
                                                />
                                                {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Bank Details</h4>
                                <div className="form-group">
                                    <label>Account Holder Name *</label>
                                    <input
                                        type="text"
                                        value={verificationForm.bankDetails.accountHolderName}
                                        onChange={(e) => setVerificationForm({
                                            ...verificationForm,
                                            bankDetails: { ...verificationForm.bankDetails, accountHolderName: e.target.value }
                                        })}
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Account Number *</label>
                                        <input
                                            type="text"
                                            value={verificationForm.bankDetails.accountNumber}
                                            onChange={(e) => setVerificationForm({
                                                ...verificationForm,
                                                bankDetails: { ...verificationForm.bankDetails, accountNumber: e.target.value }
                                            })}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>IFSC Code *</label>
                                        <input
                                            type="text"
                                            value={verificationForm.bankDetails.ifscCode}
                                            onChange={(e) => setVerificationForm({
                                                ...verificationForm,
                                                bankDetails: { ...verificationForm.bankDetails, ifscCode: e.target.value }
                                            })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="form-section">
                                <h4>Documents</h4>
                                <div className="form-group">
                                    <label>Upload Farm Documents (Optional)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,.pdf"
                                        onChange={(e) => {
                                            // Handle file upload here
                                            console.log('Files selected:', e.target.files);
                                        }}
                                    />
                                    <small>Upload photos of your farm, land documents, or other relevant certificates</small>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowVerificationModal(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-btn">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Success/Error Messages */}
            {successMessage && (
                <div className="message-overlay">
                    <div className="message-content success">
                        <span>✅</span>
                        <p>{successMessage}</p>
                        <button onClick={() => setSuccessMessage('')}>OK</button>
                    </div>
                </div>
            )}

            {error && (
                <div className="message-overlay">
                    <div className="message-content error">
                        <span>❌</span>
                        <p>{error}</p>
                        <button onClick={() => setError('')}>OK</button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default FarmerDashboard;