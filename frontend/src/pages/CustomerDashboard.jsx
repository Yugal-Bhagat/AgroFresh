import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
    };

    // Dummy user data
    const [user, setUser] = useState({
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        address: '123 Green Street, Farmville, Delhi - 110001',
        joinDate: 'January 15, 2026',
        avatar: '👨‍🌾'
    });

    // Dummy orders data
    const orders = [
        { id: '#ORD001', date: 'Mar 15, 2026', items: 3, total: 450, status: 'delivered', farmer: 'Ramesh Kumar' },
        { id: '#ORD002', date: 'Mar 10, 2026', items: 2, total: 240, status: 'shipped', farmer: 'Priya Sharma' },
        { id: '#ORD003', date: 'Mar 5, 2026', items: 5, total: 890, status: 'processing', farmer: 'Green Fields' },
        { id: '#ORD004', date: 'Feb 28, 2026', items: 1, total: 120, status: 'delivered', farmer: 'Happy Hens' }
    ];

    // Dummy wishlist
    const wishlist = [
        { id: 1, name: 'Organic Apples', price: 120, unit: 'kg', farmer: 'Priya Sharma', image: '🍎' },
        { id: 2, name: 'Fresh Tomatoes', price: 40, unit: 'kg', farmer: 'Ramesh Kumar', image: '🍅' },
        { id: 3, name: 'Free Range Eggs', price: 90, unit: 'dozen', farmer: 'Happy Hens', image: '🥚' }
    ];

    const getStatusBadge = (status) => {
        const badges = {
            delivered: 'status-delivered',
            shipped: 'status-shipped',
            processing: 'status-processing'
        };
        return badges[status] || 'status-processing';
    };

    return (
        <div className="customer-dashboard">
            <div className="dashboard-container">

                {/* Sidebar */}
                <aside className="dashboard-sidebar">
                    <div className="sidebar-header">
                        <div className="avatar">{user.avatar}</div>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
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
                            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <span className="nav-icon">📦</span>
                            <span>My Orders</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                            onClick={() => setActiveTab('wishlist')}
                        >
                            <span className="nav-icon">❤️</span>
                            <span>Wishlist</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                            onClick={() => setActiveTab('profile')}
                        >
                            <span className="nav-icon">👤</span>
                            <span>Profile</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <span className="nav-icon">📍</span>
                            <span>Addresses</span>
                        </button>
                        <button
                            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <span className="nav-icon">⚙️</span>
                            <span>Settings</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-btn" onClick={handleLogout}>
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
                                    <h2>Welcome back, {user.name.split(' ')[0]}! 👋</h2>
                                    <p>Here's what's happening with your farm-to-home deliveries</p>
                                </div>
                                <div className="welcome-stats">
                                    <div className="stat-card">
                                        <span className="stat-value">{orders.filter(o => o.status === 'delivered').length}</span>
                                        <span className="stat-label">Delivered Orders</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{orders.filter(o => o.status !== 'delivered').length}</span>
                                        <span className="stat-label">Active Orders</span>
                                    </div>
                                    <div className="stat-card">
                                        <span className="stat-value">{wishlist.length}</span>
                                        <span className="stat-label">Wishlist Items</span>
                                    </div>
                                </div>
                            </div>

                            <div className="recent-orders">
                                <div className="section-header">
                                    <h3>Recent Orders</h3>
                                    <button className="view-all" onClick={() => setActiveTab('orders')}>View All →</button>
                                </div>
                                <div className="orders-table-container">
                                    <table className="orders-table">
                                        <thead>
                                            <tr><th>Order ID</th><th>Date</th><th>Farmer</th><th>Items</th><th>Total</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {orders.slice(0, 3).map(order => (
                                                <tr key={order.id}>
                                                    <td>{order.id}</td>
                                                    <td>{order.date}</td>
                                                    <td>{order.farmer}</td>
                                                    <td>{order.items}</td>
                                                    <td>₹{order.total}</td>
                                                    <td><span className={`status-badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="quick-actions">
                                <h3>Quick Actions</h3>
                                <div className="action-grid">
                                    <Link to="/marketplace" className="action-card">
                                        <span>🛒</span>
                                        <span>Shop Now</span>
                                    </Link>
                                    <Link to="/marketplace" className="action-card">
                                        <span>❤️</span>
                                        <span>View Wishlist</span>
                                    </Link>
                                    <button className="action-card" onClick={() => setActiveTab('profile')}>
                                        <span>👤</span>
                                        <span>Edit Profile</span>
                                    </button>
                                    <Link to="/feedback" className="action-card">
                                        <span>💬</span>
                                        <span>Give Feedback</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Orders Tab */}
                    {activeTab === 'orders' && (
                        <div className="tab-content fade-in">
                            <h2>My Orders</h2>
                            <div className="orders-table-container full">
                                <table className="orders-table">
                                    <thead>
                                        <tr><th>Order ID</th><th>Date</th><th>Farmer</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(order => (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.date}</td>
                                                <td>{order.farmer}</td>
                                                <td>{order.items}</td>
                                                <td>₹{order.total}</td>
                                                <td><span className={`status-badge ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                                                <td><button className="track-btn">Track</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Wishlist Tab */}
                    {activeTab === 'wishlist' && (
                        <div className="tab-content fade-in">
                            <h2>My Wishlist</h2>
                            <div className="wishlist-grid">
                                {wishlist.map(item => (
                                    <div className="wishlist-card" key={item.id}>
                                        <div className="wishlist-image">{item.image}</div>
                                        <div className="wishlist-details">
                                            <h4>{item.name}</h4>
                                            <p className="wishlist-farmer">{item.farmer}</p>
                                            <p className="wishlist-price">₹{item.price}/{item.unit}</p>
                                        </div>
                                        <div className="wishlist-actions">
                                            <button className="add-cart-wishlist">Add to Cart</button>
                                            <button className="remove-wishlist">Remove</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="tab-content fade-in">
                            <div className="profile-header">
                                <h2>Profile Information</h2>
                                <button className="edit-btn" onClick={() => setIsEditing(!isEditing)}>
                                    {isEditing ? 'Cancel' : 'Edit Profile'}
                                </button>
                            </div>
                            <div className="profile-form">
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input type="text" value={user.name} disabled={!isEditing} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input type="email" value={user.email} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={user.phone} disabled={!isEditing} />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea rows="3" value={user.address} disabled={!isEditing}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Member Since</label>
                                    <input type="text" value={user.joinDate} disabled />
                                </div>
                                {isEditing && (
                                    <button className="save-btn">Save Changes</button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Addresses Tab */}
                    {activeTab === 'addresses' && (
                        <div className="tab-content fade-in">
                            <div className="addresses-header">
                                <h2>My Addresses</h2>
                                <button className="add-address-btn">+ Add New Address</button>
                            </div>
                            <div className="addresses-grid">
                                <div className="address-card default">
                                    <div className="address-badge">Default</div>
                                    <h4>Home</h4>
                                    <p>{user.address}</p>
                                    <p>Phone: {user.phone}</p>
                                    <div className="address-actions">
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </div>
                                </div>
                                <div className="address-card">
                                    <h4>Farm Office</h4>
                                    <p>456 Agriculture Complex, Rural District, Delhi - 110002</p>
                                    <p>Phone: +91 98765 43211</p>
                                    <div className="address-actions">
                                        <button>Set Default</button>
                                        <button>Edit</button>
                                        <button>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="tab-content fade-in">
                            <h2>Settings</h2>
                            <div className="settings-group">
                                <h3>Notifications</h3>
                                <label className="switch-label">
                                    <input type="checkbox" defaultChecked />
                                    <span>Email notifications for order updates</span>
                                </label>
                                <label className="switch-label">
                                    <input type="checkbox" defaultChecked />
                                    <span>SMS notifications for delivery status</span>
                                </label>
                                <label className="switch-label">
                                    <input type="checkbox" />
                                    <span>Weekly newsletter with farming tips</span>
                                </label>
                            </div>
                            <div className="settings-group">
                                <h3>Privacy</h3>
                                <label className="switch-label">
                                    <input type="checkbox" defaultChecked />
                                    <span>Show my name in reviews</span>
                                </label>
                                <label className="switch-label">
                                    <input type="checkbox" />
                                    <span>Share purchase history with farmers</span>
                                </label>
                            </div>
                            <div className="settings-group">
                                <h3>Change Password</h3>
                                <input type="password" placeholder="Current Password" />
                                <input type="password" placeholder="New Password" />
                                <input type="password" placeholder="Confirm New Password" />
                                <button className="update-password-btn">Update Password</button>
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default CustomerDashboard;