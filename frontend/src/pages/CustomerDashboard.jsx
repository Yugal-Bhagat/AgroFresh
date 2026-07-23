import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'overview');
    const [isEditing, setIsEditing] = useState(false);
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.tab) setActiveTab(location.state.tab);
    }, [location.state]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                setOrders(
                    data.map((o) => ({
                        id: `#${o._id.slice(-6).toUpperCase()}`,
                        date: new Date(o.createdAt).toLocaleDateString(),
                        items: o.products.reduce((s, p) => s + p.quantity, 0),
                        total: o.totalAmount,
                        status: o.orderStatus,
                        farmer: o.farmer?.fullName || '—',
                    })),
                );
            } catch (err) {
                console.error('Orders fetch failed', err);
            }
        };
        fetchOrders();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/login");
    };

    const [user, setUser] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        joinDate: '',
        avatar: '👤',
    });

    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                const u = data.user || data;
                setUser({
                    name: u.fullName || '',
                    email: u.email || '',
                    phone: u.mobile || '',
                    address: u.address || '',
                    joinDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '',
                    avatar: '👤',
                });
            } catch (err) {
                console.error('Profile fetch failed', err);
            }
        };

        const fetchWishlist = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!res.ok) return;
                const data = await res.json();
                setWishlist(
                    (data.products || []).filter(Boolean).map((p) => ({
                        id: p._id,
                        name: p.name,
                        price: p.price,
                        unit: p.quantityUnit,
                        farmer: p.farmer?.fullName || '—',
                        image: p.images?.[0] || '',
                    })),
                );
            } catch (err) {
                console.error('Wishlist fetch failed', err);
            }
        };

        fetchProfile();
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const removeFromWishlist = async (productId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to remove');
            setWishlist((prev) => prev.filter((w) => w.id !== productId));
        } catch (err) {
            alert(err.message);
        }
    };

    const saveProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    fullName: user.name,
                    mobile: user.phone,
                    address: user.address,
                }),
            });
            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.message || 'Failed to update profile');
            }
            setIsEditing(false);
            alert('Profile updated');
        } catch (err) {
            alert(err.message);
        }
    };

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
                            {wishlist.length === 0 ? (
                                <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                                    <p>Your wishlist is empty.</p>
                                    <Link
                                        to="/marketplace"
                                        style={{
                                            display: 'inline-block',
                                            marginTop: '1rem',
                                            background: '#2e7d32',
                                            color: 'white',
                                            padding: '8px 18px',
                                            borderRadius: '20px',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Browse Marketplace
                                    </Link>
                                </div>
                            ) : (
                                <div className="wishlist-grid">
                                    {wishlist.map(item => (
                                        <div className="wishlist-card" key={item.id}>
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8 }}
                                                />
                                            ) : (
                                                <div className="wishlist-image">🛒</div>
                                            )}
                                            <div className="wishlist-details">
                                                <h4>{item.name}</h4>
                                                <p className="wishlist-farmer">by {item.farmer}</p>
                                                <p className="wishlist-price">₹{item.price}/{item.unit}</p>
                                            </div>
                                            <div className="wishlist-actions">
                                                <Link
                                                    to={`/product/${item.id}`}
                                                    className="add-cart-wishlist"
                                                    style={{ textAlign: 'center', textDecoration: 'none' }}
                                                >
                                                    View Product
                                                </Link>
                                                <button
                                                    className="remove-wishlist"
                                                    onClick={() => removeFromWishlist(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
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
                                    <input type="email" value={user.email} disabled />
                                </div>
                                <div className="form-group">
                                    <label>Phone Number</label>
                                    <input type="tel" value={user.phone} disabled={!isEditing} onChange={(e) => setUser({ ...user, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Address</label>
                                    <textarea rows="3" value={user.address} disabled={!isEditing} onChange={(e) => setUser({ ...user, address: e.target.value })}></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Member Since</label>
                                    <input type="text" value={user.joinDate} disabled />
                                </div>
                                {isEditing && (
                                    <button className="save-btn" onClick={saveProfile}>Save Changes</button>
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
                                {user.address ? (
                                    <div className="address-card default">
                                        <div className="address-badge">Default</div>
                                        <h4>Home</h4>
                                        <p>{user.address}</p>
                                        <p>Phone: {user.phone}</p>
                                        <div className="address-actions">
                                            <button onClick={() => setActiveTab('profile')}>Edit in Profile</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
                                        No address saved yet. Add one in your Profile tab.
                                    </p>
                                )}
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