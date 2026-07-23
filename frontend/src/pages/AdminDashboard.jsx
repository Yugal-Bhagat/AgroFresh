import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [farmers, setFarmers] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [verifyingFarmerId, setVerifyingFarmerId] = useState(null);
    const [activeTab, setActiveTab] = useState('farmers');
    const [services, setServices] = useState([]);
    const [schemes, setSchemes] = useState([]);
    const [serviceForm, setServiceForm] = useState({ icon: '', title: '', desc: '' });
    const [editingServiceId, setEditingServiceId] = useState(null);
    const emptySchemeForm = {
        type: 'main',
        title: '',
        category: '',
        description: '',
        benefit: '',
        deadline: '',
        status: 'active',
        icon: '',
        link: '',
        details: '',
        source: '',
    };
    const [schemeForm, setSchemeForm] = useState(emptySchemeForm);
    const [editingSchemeId, setEditingSchemeId] = useState(null);
    const [contactMessages, setContactMessages] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [usersFilter, setUsersFilter] = useState('all');
    const [allReviews, setAllReviews] = useState([]);

    const fetchPendingFarmers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const userType = localStorage.getItem("userType");

            if (userType !== "admin") {
                navigate("/");
                return;
            }

            const res = await fetch("http://localhost:5000/api/admin/pending-farmers", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch pending farmers");
            }

            const data = await res.json();
            setFarmers(data);
            setError("");
        } catch (err) {
            console.error("Error fetching farmers:", err);
            setError("Failed to load pending farmers");
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingVerifications = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/admin/pending-verifications", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch pending verifications");
            }

            const data = await res.json();
            setVerifications(data);
        } catch (err) {
            console.error("Error fetching verifications:", err);
            setError("Failed to load pending verifications");
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/services");
            if (!res.ok) throw new Error("Failed to fetch services");
            const data = await res.json();
            setServices(data);
        } catch (err) {
            console.error("Error fetching services:", err);
        }
    };

    const fetchSchemes = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/schemes");
            if (!res.ok) throw new Error("Failed to fetch schemes");
            const data = await res.json();
            setSchemes(data);
        } catch (err) {
            console.error("Error fetching schemes:", err);
        }
    };

    const fetchAllUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch users");
            const data = await res.json();
            setAllUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchAllReviews = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/admin/reviews", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch reviews");
            const data = await res.json();
            setAllReviews(data);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm("Delete this review? This will recompute product and farmer ratings.")) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to delete review");
            await fetchAllReviews();
            flashSuccess("Review deleted");
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:5000/api/contact", {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Failed to fetch contact messages");
            const data = await res.json();
            setContactMessages(data);
        } catch (err) {
            console.error("Error fetching contact messages:", err);
        }
    };

    useEffect(() => {
        fetchPendingFarmers();
        fetchPendingVerifications();
        fetchServices();
        fetchSchemes();
        fetchContactMessages();
        fetchAllUsers();
        fetchAllReviews();
    }, []);

    const authHeaders = () => ({
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    });

    const flashSuccess = (msg) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(""), 3000);
    };

    const handleSubmitService = async (e) => {
        e.preventDefault();
        try {
            const url = editingServiceId
                ? `http://localhost:5000/api/services/${editingServiceId}`
                : "http://localhost:5000/api/services";
            const method = editingServiceId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(serviceForm),
            });
            if (!res.ok) throw new Error("Failed to save service");
            await fetchServices();
            setServiceForm({ icon: '', title: '', desc: '' });
            setEditingServiceId(null);
            flashSuccess(editingServiceId ? "Service updated" : "Service added");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditService = (service) => {
        setEditingServiceId(service._id);
        setServiceForm({ icon: service.icon || '', title: service.title || '', desc: service.desc || '' });
    };

    const handleDeleteService = async (id) => {
        if (!window.confirm("Delete this service?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/services/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Failed to delete service");
            await fetchServices();
            flashSuccess("Service deleted");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmitScheme = async (e) => {
        e.preventDefault();
        try {
            const url = editingSchemeId
                ? `http://localhost:5000/api/schemes/${editingSchemeId}`
                : "http://localhost:5000/api/schemes";
            const method = editingSchemeId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: authHeaders(),
                body: JSON.stringify(schemeForm),
            });
            if (!res.ok) throw new Error("Failed to save scheme");
            await fetchSchemes();
            setSchemeForm(emptySchemeForm);
            setEditingSchemeId(null);
            flashSuccess(editingSchemeId ? "Scheme updated" : "Scheme added");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEditScheme = (scheme) => {
        setEditingSchemeId(scheme._id);
        setSchemeForm({
            type: scheme.type || 'main',
            title: scheme.title || '',
            category: scheme.category || '',
            description: scheme.description || '',
            benefit: scheme.benefit || '',
            deadline: scheme.deadline || '',
            status: scheme.status || 'active',
            icon: scheme.icon || '',
            link: scheme.link || '',
            details: scheme.details || '',
            source: scheme.source || '',
        });
    };

    const handleDeleteScheme = async (id) => {
        if (!window.confirm("Delete this scheme?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/schemes/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Failed to delete scheme");
            await fetchSchemes();
            flashSuccess("Scheme deleted");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleMarkMessageRead = async (id) => {
        try {
            const res = await fetch(`http://localhost:5000/api/contact/${id}/read`, {
                method: "PUT",
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Failed to update message");
            await fetchContactMessages();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteMessage = async (id) => {
        if (!window.confirm("Delete this message?")) return;
        try {
            const res = await fetch(`http://localhost:5000/api/contact/${id}`, {
                method: "DELETE",
                headers: authHeaders(),
            });
            if (!res.ok) throw new Error("Failed to delete message");
            await fetchContactMessages();
            flashSuccess("Message deleted");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleVerifyFarmer = async (userId, status) => {
        try {
            setVerifyingFarmerId(userId);
            const token = localStorage.getItem("token");

            const res = await fetch(`http://localhost:5000/api/admin/verify/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) {
                throw new Error("Failed to verify farmer");
            }

            setSuccessMessage(
                `Farmer ${status === "approved" ? "approved" : "rejected"} successfully!`
            );

            setFarmers((prev) => prev.filter((f) => f._id !== userId));

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error verifying farmer:", err);
            setError("Failed to verify farmer");
        } finally {
            setVerifyingFarmerId(null);
        }
    };

    const handleProcessVerification = async (applicationId, status, adminNotes = "", rejectionReason = "") => {
        try {
            setVerifyingFarmerId(applicationId);
            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:5000/api/admin/process-verification/${applicationId}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ status, adminNotes, rejectionReason }),
                }
            );

            if (!res.ok) {
                throw new Error("Failed to process verification");
            }

            setSuccessMessage(
                `Seller verification ${status === "approved" ? "approved" : "rejected"} successfully!`
            );

            setVerifications((prev) => prev.filter((v) => v._id !== applicationId));

            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error("Error processing verification:", err);
            setError("Failed to process verification");
        } finally {
            setVerifyingFarmerId(null);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        navigate("/login");
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="loading">
                    <p>Loading pending farmers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Header */}
                <div className="admin-header">
                    <div className="admin-title">
                        <h1>Admin Dashboard</h1>
                        <p>Manage farmer verifications</p>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Messages */}
                {error && <div className="alert alert-error">{error}</div>}
                {successMessage && (
                    <div className="alert alert-success">{successMessage}</div>
                )}

                {/* Stats */}
                <div className="stats-section">
                    <div className="stat-card">
                        <h3>Pending Farmers</h3>
                        <p className="stat-number">{farmers.length}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Pending Verifications</h3>
                        <p className="stat-number">{verifications.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'farmers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('farmers')}
                    >
                        Farmer Verification
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'verifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('verifications')}
                    >
                        Seller Verification
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`}
                        onClick={() => setActiveTab('services')}
                    >
                        Manage Services
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'schemes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schemes')}
                    >
                        Manage Schemes
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
                        onClick={() => setActiveTab('messages')}
                    >
                        Contact Messages
                        {contactMessages.filter((m) => !m.isRead).length > 0 && (
                            <span className="unread-badge">
                                {contactMessages.filter((m) => !m.isRead).length}
                            </span>
                        )}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        All Users
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Product Reviews
                    </button>
                </div>

                {/* Content based on active tab */}
                {activeTab === 'farmers' && (
                    <div className="farmers-section">
                        <h2>Pending Farmer Verifications</h2>

                        {farmers.length === 0 ? (
                            <div className="no-farmers">
                                <p>No pending farmer verifications at the moment.</p>
                            </div>
                        ) : (
                            <div className="farmers-grid">
                                {farmers.map((farmer) => (
                                    <div key={farmer._id} className="farmer-card">
                                        <div className="farmer-header">
                                            <div className="farmer-info">
                                                <h3>{farmer.fullName}</h3>
                                                <p className="farmer-email">{farmer.email}</p>
                                            </div>
                                            <span className="status-badge pending">Pending</span>
                                        </div>

                                        <div className="farmer-details">
                                            <div className="detail-row">
                                                <span className="label">Phone:</span>
                                                <span className="value">{farmer.mobile}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Address:</span>
                                                <span className="value">{farmer.address}</span>
                                            </div>

                                            {farmer.farmerDetails?.farmName && (
                                                <div className="detail-row">
                                                    <span className="label">Farm Name:</span>
                                                    <span className="value">{farmer.farmerDetails.farmName}</span>
                                                </div>
                                            )}

                                            {farmer.farmerDetails?.farmLocation && (
                                                <div className="detail-row">
                                                    <span className="label">Farm Location:</span>
                                                    <span className="value">
                                                        {farmer.farmerDetails.farmLocation}
                                                    </span>
                                                </div>
                                            )}

                                            {farmer.location && (
                                                <div className="detail-row">
                                                    <span className="label">Location:</span>
                                                    <span className="value">
                                                        {farmer.location.city && `${farmer.location.city}, `}
                                                        {farmer.location.state && `${farmer.location.state} `}
                                                        {farmer.location.pincode && `- ${farmer.location.pincode}`}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="farmer-actions">
                                            <button
                                                className="btn btn-approve"
                                                onClick={() => handleVerifyFarmer(farmer._id, "approved")}
                                                disabled={verifyingFarmerId === farmer._id}
                                            >
                                                {verifyingFarmerId === farmer._id ? "Processing..." : "Approve"}
                                            </button>
                                            <button
                                                className="btn btn-reject"
                                                onClick={() => handleVerifyFarmer(farmer._id, "rejected")}
                                                disabled={verifyingFarmerId === farmer._id}
                                            >
                                                {verifyingFarmerId === farmer._id ? "Processing..." : "Reject"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'verifications' && (
                    <div className="verifications-section">
                        <h2>Pending Seller Verification Applications</h2>

                        {verifications.length === 0 ? (
                            <div className="no-farmers">
                                <p>No pending seller verification applications at the moment.</p>
                            </div>
                        ) : (
                            <div className="farmers-grid">
                                {verifications.map((verification) => (
                                    <div key={verification._id} className="farmer-card">
                                        <div className="farmer-header">
                                            <div className="farmer-info">
                                                <h3>{verification.farmer?.fullName}</h3>
                                                <p className="farmer-email">{verification.farmer?.email}</p>
                                            </div>
                                            <span className="status-badge pending">Pending</span>
                                        </div>

                                        <div className="farmer-details">
                                            <div className="detail-row">
                                                <span className="label">Farm Name:</span>
                                                <span className="value">{verification.farmName}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Farm Location:</span>
                                                <span className="value">{verification.farmLocation}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Farm Size:</span>
                                                <span className="value">{verification.farmSize} acres</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Crop Types:</span>
                                                <span className="value">{verification.cropTypes?.join(", ")}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Account Holder:</span>
                                                <span className="value">{verification.bankDetails?.accountHolderName}</span>
                                            </div>

                                            <div className="detail-row">
                                                <span className="label">Applied:</span>
                                                <span className="value">{new Date(verification.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="farmer-actions">
                                            <button
                                                className="btn btn-approve"
                                                onClick={() => handleProcessVerification(verification._id, "approved")}
                                                disabled={verifyingFarmerId === verification._id}
                                            >
                                                {verifyingFarmerId === verification._id ? "Processing..." : "Approve"}
                                            </button>
                                            <button
                                                className="btn btn-reject"
                                                onClick={() => handleProcessVerification(verification._id, "rejected")}
                                                disabled={verifyingFarmerId === verification._id}
                                            >
                                                {verifyingFarmerId === verification._id ? "Processing..." : "Reject"}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'services' && (
                    <div className="management-section">
                        <h2>Manage Services</h2>

                        <form className="management-form" onSubmit={handleSubmitService}>
                            <h3>{editingServiceId ? "Edit Service" : "Add New Service"}</h3>
                            <div className="management-grid">
                                <input
                                    type="text"
                                    placeholder="Icon (emoji)"
                                    value={serviceForm.icon}
                                    onChange={(e) => setServiceForm({ ...serviceForm, icon: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={serviceForm.title}
                                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                                    required
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                rows="3"
                                value={serviceForm.desc}
                                onChange={(e) => setServiceForm({ ...serviceForm, desc: e.target.value })}
                                required
                            />
                            <div className="management-actions">
                                <button type="submit" className="btn btn-approve">
                                    {editingServiceId ? "Update Service" : "Add Service"}
                                </button>
                                {editingServiceId && (
                                    <button
                                        type="button"
                                        className="btn btn-reject"
                                        onClick={() => {
                                            setEditingServiceId(null);
                                            setServiceForm({ icon: '', title: '', desc: '' });
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="management-list">
                            {services.length === 0 ? (
                                <p>No services yet.</p>
                            ) : (
                                services.map((service) => (
                                    <div key={service._id} className="management-item">
                                        <div className="management-item-info">
                                            <span className="management-icon">{service.icon}</span>
                                            <div>
                                                <h4>{service.title}</h4>
                                                <p>{service.desc}</p>
                                            </div>
                                        </div>
                                        <div className="management-item-actions">
                                            <button className="btn btn-approve" onClick={() => handleEditService(service)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-reject" onClick={() => handleDeleteService(service._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'schemes' && (
                    <div className="management-section">
                        <h2>Manage Schemes</h2>

                        <form className="management-form" onSubmit={handleSubmitScheme}>
                            <h3>{editingSchemeId ? "Edit Scheme" : "Add New Scheme"}</h3>
                            <div className="management-grid">
                                <select
                                    value={schemeForm.type}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, type: e.target.value })}
                                >
                                    <option value="main">Main Scheme</option>
                                    <option value="new">Newly Announced</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Icon (emoji)"
                                    value={schemeForm.icon}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, icon: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Title *"
                                    value={schemeForm.title}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, title: e.target.value })}
                                    required
                                />
                                <input
                                    type="text"
                                    placeholder="Category"
                                    value={schemeForm.category}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, category: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Benefit"
                                    value={schemeForm.benefit}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, benefit: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Deadline"
                                    value={schemeForm.deadline}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, deadline: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Status (active / coming-soon)"
                                    value={schemeForm.status}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, status: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Apply Link"
                                    value={schemeForm.link}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, link: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Source (for newly announced)"
                                    value={schemeForm.source}
                                    onChange={(e) => setSchemeForm({ ...schemeForm, source: e.target.value })}
                                />
                            </div>
                            <textarea
                                placeholder="Description"
                                rows="3"
                                value={schemeForm.description}
                                onChange={(e) => setSchemeForm({ ...schemeForm, description: e.target.value })}
                            />
                            <textarea
                                placeholder="Details (highlight)"
                                rows="2"
                                value={schemeForm.details}
                                onChange={(e) => setSchemeForm({ ...schemeForm, details: e.target.value })}
                            />
                            <div className="management-actions">
                                <button type="submit" className="btn btn-approve">
                                    {editingSchemeId ? "Update Scheme" : "Add Scheme"}
                                </button>
                                {editingSchemeId && (
                                    <button
                                        type="button"
                                        className="btn btn-reject"
                                        onClick={() => {
                                            setEditingSchemeId(null);
                                            setSchemeForm(emptySchemeForm);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>

                        <div className="management-list">
                            {schemes.length === 0 ? (
                                <p>No schemes yet.</p>
                            ) : (
                                schemes.map((scheme) => (
                                    <div key={scheme._id} className="management-item">
                                        <div className="management-item-info">
                                            <span className="management-icon">{scheme.icon}</span>
                                            <div>
                                                <h4>{scheme.title} <small>({scheme.type})</small></h4>
                                                <p>{scheme.description}</p>
                                                {scheme.benefit && <small><strong>Benefit:</strong> {scheme.benefit}</small>}
                                            </div>
                                        </div>
                                        <div className="management-item-actions">
                                            <button className="btn btn-approve" onClick={() => handleEditScheme(scheme)}>
                                                Edit
                                            </button>
                                            <button className="btn btn-reject" onClick={() => handleDeleteScheme(scheme._id)}>
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="management-section">
                        <h2>All Users</h2>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                            {[
                                { key: 'all', label: `All (${allUsers.length})` },
                                { key: 'customer', label: `Customers (${allUsers.filter(u => u.userType === 'customer').length})` },
                                { key: 'farmer', label: `Farmers (${allUsers.filter(u => u.userType === 'farmer').length})` },
                                { key: 'admin', label: `Admins (${allUsers.filter(u => u.userType === 'admin').length})` },
                            ].map((f) => (
                                <button
                                    key={f.key}
                                    className={`tab-btn ${usersFilter === f.key ? 'active' : ''}`}
                                    onClick={() => setUsersFilter(f.key)}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="management-list">
                            {allUsers.length === 0 ? (
                                <p>No users found.</p>
                            ) : (
                                allUsers
                                    .filter((u) => usersFilter === 'all' || u.userType === usersFilter)
                                    .map((u) => (
                                        <div key={u._id} className="management-item">
                                            <div className="management-item-info">
                                                <div style={{ flex: 1 }}>
                                                    <h4>
                                                        {u.fullName}
                                                        <span
                                                            className="status-badge"
                                                            style={{
                                                                marginLeft: '0.5rem',
                                                                fontSize: '0.7rem',
                                                                padding: '2px 8px',
                                                                background: u.userType === 'admin' ? '#1976d2' : u.userType === 'farmer' ? '#2e7d32' : '#7b1fa2',
                                                                color: 'white',
                                                                borderRadius: '12px',
                                                                textTransform: 'uppercase',
                                                            }}
                                                        >
                                                            {u.userType}
                                                        </span>
                                                        {u.userType === 'farmer' && u.verification?.status === 'approved' && (
                                                            <span
                                                                style={{
                                                                    marginLeft: '0.5rem',
                                                                    fontSize: '0.7rem',
                                                                    padding: '2px 8px',
                                                                    background: '#43a047',
                                                                    color: 'white',
                                                                    borderRadius: '12px',
                                                                }}
                                                            >
                                                                ✓ Verified
                                                            </span>
                                                        )}
                                                    </h4>
                                                    <p>📧 {u.email}</p>
                                                    <p>📞 {u.mobile}</p>
                                                    {u.address && <p>📍 {u.address}</p>}
                                                    {u.userType === 'farmer' && u.farmerDetails?.farmName && (
                                                        <p>🌾 Farm: {u.farmerDetails.farmName}{u.farmerDetails.farmLocation ? ` — ${u.farmerDetails.farmLocation}` : ''}</p>
                                                    )}
                                                    {u.userType === 'farmer' && (
                                                        <p>⭐ {Number(u.averageRating || u.rating || 0).toFixed(1)} ({u.totalReviews || 0} reviews)</p>
                                                    )}
                                                    <small>Joined: {new Date(u.createdAt).toLocaleDateString()}</small>
                                                </div>
                                            </div>
                                            <div className="management-item-actions">
                                                <a
                                                    className="btn btn-approve"
                                                    href={`mailto:${u.email}`}
                                                >
                                                    Email
                                                </a>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="management-section">
                        <h2>Product Reviews</h2>
                        <p style={{ color: '#666', marginBottom: '1rem' }}>
                            Total reviews: {allReviews.length}. Deleting a review will automatically recompute the product's average rating.
                        </p>
                        <div className="management-list">
                            {allReviews.length === 0 ? (
                                <p>No reviews yet.</p>
                            ) : (
                                allReviews.map((rev) => (
                                    <div key={rev._id} className="management-item">
                                        <div className="management-item-info">
                                            <div style={{ flex: 1 }}>
                                                <h4>
                                                    {rev.product?.name || 'Deleted product'}{' '}
                                                    <span style={{ color: '#f5a623' }}>{'⭐'.repeat(rev.rating)}</span>{' '}
                                                    <small style={{ color: '#666' }}>({rev.rating}/5)</small>
                                                </h4>
                                                <p>
                                                    <strong>By:</strong>{' '}
                                                    {rev.user?.fullName || 'Unknown user'} &lt;{rev.user?.email || '—'}&gt;
                                                </p>
                                                {rev.product?.farmer && (
                                                    <p>
                                                        <strong>Seller:</strong>{' '}
                                                        {rev.product.farmer.fullName} &lt;{rev.product.farmer.email}&gt;
                                                    </p>
                                                )}
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{rev.comment}</p>
                                                <small>{new Date(rev.createdAt).toLocaleString()}</small>
                                            </div>
                                        </div>
                                        <div className="management-item-actions">
                                            {rev.product?._id && (
                                                <a
                                                    className="btn btn-approve"
                                                    href={`/product/${rev.product._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    View
                                                </a>
                                            )}
                                            <button
                                                className="btn btn-reject"
                                                onClick={() => handleDeleteReview(rev._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'messages' && (
                    <div className="management-section">
                        <h2>Contact Messages</h2>
                        <div className="management-list">
                            {contactMessages.length === 0 ? (
                                <p>No contact messages yet.</p>
                            ) : (
                                contactMessages.map((msg) => (
                                    <div
                                        key={msg._id}
                                        className={`management-item ${!msg.isRead ? 'unread-message' : ''}`}
                                    >
                                        <div className="management-item-info">
                                            <div style={{ flex: 1 }}>
                                                <h4>
                                                    {msg.subject}
                                                    {!msg.isRead && (
                                                        <span className="new-tag"> NEW</span>
                                                    )}
                                                </h4>
                                                <p>
                                                    <strong>From:</strong> {msg.name} &lt;{msg.email}&gt;
                                                </p>
                                                <p style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</p>
                                                <small>
                                                    {new Date(msg.createdAt).toLocaleString()}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="management-item-actions">
                                            {!msg.isRead && (
                                                <button
                                                    className="btn btn-approve"
                                                    onClick={() => handleMarkMessageRead(msg._id)}
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                            <a
                                                className="btn btn-approve"
                                                href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                                            >
                                                Reply
                                            </a>
                                            <button
                                                className="btn btn-reject"
                                                onClick={() => handleDeleteMessage(msg._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
