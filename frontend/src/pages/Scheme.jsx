import React, { useEffect, useState } from 'react';
import './Scheme.css';

const Schemes = () => {
    const [allSchemes, setAllSchemes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchemes = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/schemes');
                if (!res.ok) throw new Error('Failed to load schemes');
                const data = await res.json();
                setAllSchemes(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchSchemes();
    }, []);

    const schemes = allSchemes.filter((s) => s.type !== 'new');
    const newSchemes = allSchemes.filter((s) => s.type === 'new');

    return (
        <div className="schemes-page">
            <div className="schemes-container">

                {/* Header */}
                <div className="schemes-header">
                    <h1>Government Schemes for Farmers</h1>
                    <p>Real-time information on central and state schemes</p>
                    <div className="header-badge">
                        <span className="live-badge">🔴 LIVE</span>
                        <span>PM Kisan 22nd Installment: March 13, 2026</span>
                    </div>
                </div>

                {loading && <p style={{ textAlign: 'center' }}>Loading schemes...</p>}
                {error && <p style={{ textAlign: 'center', color: 'crimson' }}>{error}</p>}

                {/* Real-time Alert for PM Kisan */}
                <div className="alert-banner">
                    <div className="alert-icon">📢</div>
                    <div className="alert-content">
                        <h3>PM Kisan 22nd Installment releasing on March 13, 2026</h3>
                        <p>₹2,000 will be credited directly to beneficiaries' accounts. Complete e-KYC and link Aadhaar with bank account to avoid delays. <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer">Check status on portal →</a></p>
                    </div>
                </div>

                {/* Main Schemes Grid */}
                <div className="schemes-grid">
                    {schemes.map((scheme) => (
                        <div className="scheme-card" key={scheme._id}>
                            <div className="card-header">
                                <span className="scheme-icon">{scheme.icon}</span>
                                <span className={`scheme-status status-${scheme.status}`}>
                                    {scheme.status === 'active' ? 'Active' : 'Coming Soon'}
                                </span>
                            </div>
                            <div className="card-body">
                                <h3>{scheme.title}</h3>
                                {scheme.category && <span className="scheme-category">{scheme.category}</span>}
                                <p className="scheme-description">{scheme.description}</p>
                                <div className="scheme-details">
                                    {scheme.benefit && (
                                        <div className="detail-item">
                                            <strong>Benefit:</strong> {scheme.benefit}
                                        </div>
                                    )}
                                    {scheme.deadline && (
                                        <div className="detail-item">
                                            <strong>Deadline:</strong> {scheme.deadline}
                                        </div>
                                    )}
                                    {scheme.details && (
                                        <div className="detail-item highlight">
                                            {scheme.details}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="card-footer">
                                {scheme.link ? (
                                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="scheme-link">
                                        Apply / Check Status →
                                    </a>
                                ) : (
                                    <button className="scheme-btn">Check Eligibility</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Newly Announced Schemes */}
                {newSchemes.length > 0 && (
                    <div className="new-schemes-section">
                        <h2>Newly Announced Schemes</h2>
                        <div className="new-schemes-grid">
                            {newSchemes.map((scheme) => (
                                <div className="new-scheme-card" key={scheme._id}>
                                    <div className="new-scheme-badge">NEW</div>
                                    <h3>{scheme.title}</h3>
                                    <p>{scheme.description}</p>
                                    <div className="new-scheme-footer">
                                        {scheme.benefit && <span className="benefit-tag">{scheme.benefit}</span>}
                                        {scheme.source && <span className="source-tag">{scheme.source}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Quick Links */}
                <div className="quick-links">
                    <h3>Important Portals</h3>
                    <div className="links-grid">
                        <a href="https://pmkisan.gov.in" target="_blank" rel="noopener noreferrer">PM Kisan Portal</a>
                        <a href="https://pmfby.gov.in" target="_blank" rel="noopener noreferrer">PMFBY Portal</a>
                        <a href="https://agriinfra.dac.gov.in" target="_blank" rel="noopener noreferrer">Agriculture Infrastructure Fund</a>
                        <a href="https://enam.gov.in" target="_blank" rel="noopener noreferrer">e-NAM</a>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="schemes-footer">
                    <p>Information sourced from official government portals and PIB releases.</p>
                </div>

            </div>
        </div>
    );
};

export default Schemes;
