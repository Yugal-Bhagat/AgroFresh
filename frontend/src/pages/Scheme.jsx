import React from 'react';
import './Scheme.css';

const Schemes = () => {
    // Real-time scheme data based on latest government announcements
    const schemes = [
        {
            id: 1,
            title: "PM Kisan Samman Nidhi (PM-KISAN)",
            category: "Income Support",
            description: "Financial benefit of ₹6,000 per year in three equal installments of ₹2,000 each for small and marginal farmers.",
            benefit: "₹6,000/year",
            deadline: "March 13, 2026 (22nd Installment)",
            status: "active",
            icon: "💰",
            link: "https://pmkisan.gov.in",
            details: "22nd installment releasing on March 13, 2026. Ensure e-KYC completed and Aadhaar linked to bank account."
        },
        {
            id: 2,
            title: "PM Fasal Bima Yojana (PMFBY)",
            category: "Crop Insurance",
            description: "Comprehensive crop insurance against natural disasters, pests, and diseases from pre-sowing to post-harvest.",
            benefit: "Premium subsidy up to 90%",
            deadline: "Seasonal (Kharif/Rabi)",
            status: "active",
            icon: "🌾",
            details: "States now allowed add-on cover for wild animal damage. YES-TECH technology for yield estimation now covers soybean."
        },
        {
            id: 3,
            title: "Kisan Credit Card (KCC)",
            category: "Credit Support",
            description: "Composite credit facility with 6-year tenure covering crop cultivation, allied activities, and investment needs.",
            benefit: "Limit up to ₹2 lakh (collateral-free)",
            deadline: "Ongoing",
            status: "active",
            icon: "💳",
            details: "Flexi KCC of ₹10,000-50,000 for marginal farmers. Covers animal husbandry, fisheries, post-harvest expenses, and more."
        },
        {
            id: 4,
            title: "Maharashtra Solar Agri-Feeder Scheme",
            category: "State Scheme",
            description: "Daytime solar electricity for irrigation; 8 lakh farmers already benefiting with plans to add 10,000 MW capacity.",
            benefit: "10 hours daytime power",
            deadline: "Expanding 2026-27",
            status: "active",
            icon: "☀️",
            details: "International Solar Alliance recognized flagship project. Next phase focuses on battery storage for 24/7 utilization."
        },
        {
            id: 5,
            title: "Formation & Promotion of FPOs",
            category: "Farmer Collectives",
            description: "Financial assistance up to ₹18 lakh per FPO for management, matching equity grants, and credit guarantee.",
            benefit: "₹18 lakh assistance + equity grant",
            deadline: "Ongoing",
            status: "active",
            icon: "👥",
            details: "10,000 FPOs registered as of Dec 2025. ₹430.77 Cr distributed as matching equity to 6,557 FPOs."
        },
        {
            id: 6,
            title: "Maharashtra Loan Waiver Scheme",
            category: "Debt Relief",
            description: "Eligible farmers with overdue crop loans receive relief up to ₹2 lakh. ₹50,000 incentive for regular repayers.",
            benefit: "₹2 lakh waiver / ₹50k incentive",
            deadline: "FY 2026-27",
            status: "active",
            icon: "🏦",
            details: "Part of Maharashtra Budget 2026-27. Aimed at supporting farmers with crop loan overdue."
        }
    ];

    // New schemes from Union Budget 2026-27
    const newSchemes = [
        {
            title: "Coconut Promotion Scheme",
            description: "Replace old trees with new saplings in major coconut-growing states. India is world's largest coconut producer with 30 million livelihoods dependent.",
            benefit: "Productivity enhancement",
            source: "Union Budget 2026-27"
        },
        {
            title: "Bharat-VISTAAR",
            description: "Multilingual AI tool integrating AgriStack portals and ICAR practices for customized advisory support to farmers.",
            benefit: "AI-powered farm advisory",
            source: "Union Budget 2026-27"
        },
        {
            title: "Programme for Cashew & Cocoa",
            description: "Make India self-reliant in raw cashew and cocoa production, enhance export competitiveness by 2030.",
            benefit: "Self-reliance & exports",
            source: "Union Budget 2026-27"
        },
        {
            title: "Dedicated Programme for Walnuts, Almonds & Pine Nuts",
            description: "Rejuvenate old orchards and expand high-density cultivation in hilly regions.",
            benefit: "Value addition & youth engagement",
            source: "Union Budget 2026-27"
        }
    ];

    return (
        <div className="schemes-page">
            <div className="schemes-container">
                
                {/* Header */}
                <div className="schemes-header">
                    <h1>Government Schemes for Farmers</h1>
                    <p>Real-time information on central and state schemes • Updated March 2026</p>
                    <div className="header-badge">
                        <span className="live-badge">🔴 LIVE</span>
                        <span>PM Kisan 22nd Installment: March 13, 2026</span>
                    </div>
                </div>

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
                        <div className="scheme-card" key={scheme.id}>
                            <div className="card-header">
                                <span className="scheme-icon">{scheme.icon}</span>
                                <span className={`scheme-status status-${scheme.status}`}>
                                    {scheme.status === 'active' ? 'Active' : 'Coming Soon'}
                                </span>
                            </div>
                            <div className="card-body">
                                <h3>{scheme.title}</h3>
                                <span className="scheme-category">{scheme.category}</span>
                                <p className="scheme-description">{scheme.description}</p>
                                <div className="scheme-details">
                                    <div className="detail-item">
                                        <strong>Benefit:</strong> {scheme.benefit}
                                    </div>
                                    <div className="detail-item">
                                        <strong>Deadline:</strong> {scheme.deadline}
                                    </div>
                                    <div className="detail-item highlight">
                                        {scheme.details}
                                    </div>
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

                {/* Newly Announced Schemes - Union Budget 2026-27 */}
                <div className="new-schemes-section">
                    <h2>Newly Announced Schemes (Union Budget 2026-27)</h2>
                    <div className="new-schemes-grid">
                        {newSchemes.map((scheme, index) => (
                            <div className="new-scheme-card" key={index}>
                                <div className="new-scheme-badge">NEW</div>
                                <h3>{scheme.title}</h3>
                                <p>{scheme.description}</p>
                                <div className="new-scheme-footer">
                                    <span className="benefit-tag">{scheme.benefit}</span>
                                    <span className="source-tag">{scheme.source}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

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
                    <p>Information sourced from official government portals and PIB releases. Last updated: March 10, 2026.</p>
                </div>

            </div>
        </div>
    );
};

export default Schemes;