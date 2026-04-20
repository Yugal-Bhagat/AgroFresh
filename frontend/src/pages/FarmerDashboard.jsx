import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './FarmerDashboard.css';

const FarmerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);
    const navigate = useNavigate();

    // Dummy farmer data
    const [farmer, setFarmer] = useState({
        name: 'Ramesh Kumar',
        farmName: 'Green Valley Farms',
        email: 'ramesh.kumar@agrofresh.com',
        phone: '+91 98765 43210',
        address: '123 Farm Road, Agricultural Zone, Delhi - 110001',
        joinDate: 'January 15, 2026',
        avatar: '👨‍🌾',
        totalProducts: 12,
        totalOrders: 48,
        totalEarnings: 45280,
        rating: 4.8
    });

    // Dummy products data
    const [products, setProducts] = useState([
        { id: 1, name: 'Fresh Tomatoes', price: 40, unit: 'kg', stock: 50, category: 'vegetables', image: '🍅', status: 'active', sold: 120 },
        { id: 2, name: 'Organic Apples', price: 120, unit: 'kg', stock: 30, category: 'fruits', image: '🍎', status: 'active', sold: 80 },
        { id: 3, name: 'Basmati Rice', price: 80, unit: 'kg', stock: 200, category: 'grains', image: '🌾', status: 'active', sold: 350 },
        { id: 4, name: 'Cow Milk', price: 50, unit: 'litre', stock: 100, category: 'dairy', image: '🥛', status: 'active', sold: 250 },
        { id: 5, name: 'Potatoes', price: 30, unit: 'kg', stock: 150, category: 'vegetables', image: '🥔', status: 'inactive', sold: 180 },
    ]);

    // Dummy orders received
    const orders = [
        { id: '#ORD001', customer: 'Rahul Sharma', date: 'Mar 15, 2026', items: 3, total: 450, status: 'delivered', payment: 'paid' },
        { id: '#ORD002', customer: 'Priya Mehta', date: 'Mar 14, 2026', items: 2, total: 240, status: 'shipped', payment: 'paid' },
        { id: '#ORD003', customer: 'Amit Singh', date: 'Mar 13, 2026', items: 5, total: 890, status: 'processing', payment: 'pending' },
        { id: '#ORD004', customer: 'Sunita Devi', date: 'Mar 12, 2026', items: 1, total: 120, status: 'delivered', payment: 'paid' },
        { id: '#ORD005', customer: 'Vikram Patel', date: 'Mar 11, 2026', items: 4, total: 680, status: 'cancelled', payment: 'refunded' }
    ];

    // Monthly earnings data
    const monthlyEarnings = [
        { month: 'Jan', earnings: 12500 },
        { month: 'Feb', earnings: 15200 },
        { month: 'Mar', earnings: 17580 }
    ];

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

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    return (
        <div className="farmer-dashboard">
            <div className="dashboard-container">

                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <div className="avatar">{farmer.avatar}</div>
                        <h3>{farmer.name}</h3>
                        <p>{farmer.farmName}</p>
                        <div className="farmer-rating">
                            <span>⭐ {farmer.rating}</span>
                            <span>Verified Farmer ✓</span>
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
                            className={`nav-item ${activeTab === 'schemes' ? 'active' : ''}`}
                            onClick={() => navigate('/schemes')}
                        >
                            <span className="nav-icon">🏦</span>
                            <span>Govt. Schemes</span>
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
                                    <h2>Welcome back, {farmer.name.split(' ')[0]}! 🌾</h2>
                                    <p>Here's what's happening with your farm today</p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <div className="stat-icon">🌾</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{farmer.totalProducts}</span>
                                        <span className="stat-label">Total Products</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📦</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{farmer.totalOrders}</span>
                                        <span className="stat-label">Total Orders</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">💰</div>
                                    <div className="stat-info">
                                        <span className="stat-value">₹{farmer.totalEarnings.toLocaleString()}</span>
                                        <span className="stat-label">Total Earnings</span>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">⭐</div>
                                    <div className="stat-info">
                                        <span className="stat-value">{farmer.rating}</span>
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
                                            {orders.slice(0, 3).map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.customer}</td>
                                                    <td>{order.date}</td>
                                                    <td>{order.items}</td>
                                                    <td>₹{order.total}</td>
                                                    <td><span className={`status-badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                                                    <td><span className={`payment-badge ${getPaymentBadge(order.payment)}`}>{order.payment}</span></td>
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
                                    <button className="action-card" onClick={() => setActiveTab('products')}>
                                        <span>➕</span>
                                        <span>Add Product</span>
                                    </button>
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
                                <button className="add-product-btn" onClick={() => setShowAddProduct(true)}>
                                    + Add New Product
                                </button>
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
                                {products.map(product => (
                                    <div className="product-card" key={product.id}>
                                        <div className="product-image">{product.image}</div>
                                        <div className="product-details">
                                            <h4>{product.name}</h4>
                                            <p className="product-category">{product.category}</p>
                                            <p className="product-price">₹{product.price}/{product.unit}</p>
                                            <div className="product-stats">
                                                <span>Stock: {product.stock}</span>
                                                <span>Sold: {product.sold}</span>
                                            </div>
                                            <span className={`product-status ${product.status}`}>{product.status}</span>
                                        </div>
                                        <div className="product-actions">
                                            <button className="edit-btn">Edit</button>
                                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
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
                            <div className="orders-table-container full">
                                <table className="orders-table">
                                    <thead>
                                        <tr>
                                            <th>Order ID</th><th>Customer</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Payment</th><th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.customer}</td>
                                                <td>{order.date}</td>
                                                <td>{order.items}</td>
                                                <td>₹{order.total}</td>
                                                <td><span className={`status-badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                                                <td><span className={`payment-badge ${getPaymentBadge(order.payment)}`}>{order.payment}</span></td>
                                                <td><button className="update-status-btn">Update</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Earnings Tab */}
                    {activeTab === 'earnings' && (
                        <div className="tab-content fade-in">
                            <h2>Earnings Overview</h2>
                            <div className="earnings-summary">
                                <div className="earnings-card">
                                    <h3>Total Earnings</h3>
                                    <p className="total-earnings">₹{farmer.totalEarnings.toLocaleString()}</p>
                                </div>
                                <div className="earnings-card">
                                    <h3>Pending Payout</h3>
                                    <p className="pending-earnings">₹{farmer.totalEarnings * 0.15}</p>
                                </div>
                                <div className="earnings-card">
                                    <h3>Available Balance</h3>
                                    <p className="available-earnings">₹{farmer.totalEarnings * 0.85}</p>
                                </div>
                            </div>

                            <div className="chart-container">
                                <h3>Monthly Earnings (2026)</h3>
                                <div className="bar-chart">
                                    {monthlyEarnings.map(item => (
                                        <div className="bar-item" key={item.month}>
                                            <div className="bar" style={{ height: `${(item.earnings / 20000) * 100}%` }}>
                                                <span className="bar-value">₹{item.earnings}</span>
                                            </div>
                                            <span className="bar-label">{item.month}</span>
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
                                    <input type="text" value={farmer.name} disabled={!isEditing} onChange={(e) => setFarmer({ ...farmer, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Farm Name</label>
                                    <input type="text" value={farmer.farmName} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={farmer.email} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={farmer.phone} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Farm Address</label>
                                    <textarea rows="3" value={farmer.address} disabled={!isEditing}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Member Since</label>
                                    <input type="text" value={farmer.joinDate} disabled />
                                </div>
                                {isEditing && (
                                    <button className="save-btn">Save Changes</button>
                                )}
                            </div>
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
        </div>
    );
};

export default FarmerDashboard;