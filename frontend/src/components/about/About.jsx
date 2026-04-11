import React from "react";
import "./About.css";

const About = () => {
    return (
        <section className="about">

            {/* Hero Section */}
            <div className="about-hero">
                <h1>Connecting Farmers Directly With Consumers</h1>
                <p>
                    AgroFresh is a modern agriculture platform that removes middlemen
                    and allows farmers to sell directly to customers while providing
                    fresh and organic products.
                </p>
            </div>

            {/* Mission Vision */}
            <div className="about-cards">

                <div className="about-card">
                    <h2>🌱 Our Mission</h2>
                    <p>
                        Empower farmers by giving them a digital platform to sell their
                        produce directly to customers and earn fair profits.
                    </p>
                </div>

                <div className="about-card">
                    <h2>🚀 Our Vision</h2>
                    <p>
                        Build a sustainable agriculture ecosystem where technology
                        helps farmers grow and consumers access fresh farm products.
                    </p>
                </div>

            </div>

            {/* Stats Section */}
            <div className="about-stats">

                <div className="stat">
                    <h2>1000+</h2>
                    <p>Farmers Connected</p>
                </div>

                <div className="stat">
                    <h2>5000+</h2>
                    <p>Customers Served</p>
                </div>

                <div className="stat">
                    <h2>200+</h2>
                    <p>Products Available</p>
                </div>

                <div className="stat">
                    <h2>50+</h2>
                    <p>Farming Resources</p>
                </div>

            </div>

            {/* Features */}
            <div className="about-features">

                <h2>Platform Features</h2>

                <div className="feature-grid">

                    <div className="feature-box">
                        <span>🛒</span>
                        <h3>Farmer Marketplace</h3>
                        <p>Farmers can directly sell crops to customers without middlemen.</p>
                    </div>

                    <div className="feature-box">
                        <span>📚</span>
                        <h3>Farming Tips</h3>
                        <p>Learn modern farming techniques and best practices.</p>
                    </div>

                    <div className="feature-box">
                        <span>🏛</span>
                        <h3>Government Schemes</h3>
                        <p>Stay updated with agriculture schemes and subsidies.</p>
                    </div>

                    <div className="feature-box">
                        <span>🌾</span>
                        <h3>Agro Store</h3>
                        <p>Buy seeds, fertilizers and farming equipment online.</p>
                    </div>

                </div>

            </div>

            {/* People Feedback */}
            <div className="about-feedback">

                <h2>What People Say</h2>

                <div className="feedback-grid">

                    <div className="feedback-card">
                        <p>"AgroFresh has transformed my farming business. I now earn fair prices directly!"</p>
                        <h4>- Rajesh Farmer</h4>
                    </div>

                    <div className="feedback-card">
                        <p>"Fresh organic produce delivered to my doorstep. Highly recommended!"</p>
                        <h4>- Priya Customer</h4>
                    </div>

                    <div className="feedback-card">
                        <p>"The farming tips and resources have improved my crop yield significantly."</p>
                        <h4>- Kumar Farmer</h4>
                    </div>

                </div>

            </div>

        </section>
    );
};

export default About;