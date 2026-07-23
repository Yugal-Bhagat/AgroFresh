import React, { useEffect, useRef, useState } from "react";
import "./About.css";

const fallbackFeedbacks = [
    { _id: 'f1', name: 'Rajesh Farmer', userType: 'farmer', rating: 5, message: 'AgroFresh has transformed my farming business. I now earn fair prices directly!' },
    { _id: 'f2', name: 'Priya Customer', userType: 'customer', rating: 5, message: 'Fresh organic produce delivered to my doorstep. Highly recommended!' },
    { _id: 'f3', name: 'Kumar Farmer', userType: 'farmer', rating: 5, message: 'The farming tips and resources have improved my crop yield significantly.' },
];

const roleLabel = (userType) => {
    if (userType === 'farmer') return 'Farmer';
    if (userType === 'customer') return 'Customer';
    return '';
};

const formatStat = (n) => {
    if (n >= 1000) return `${Math.floor(n / 1000)}k+`;
    if (n >= 100) return `${Math.floor(n / 100) * 100}+`;
    if (n >= 10) return `${Math.floor(n / 10) * 10}+`;
    return `${n}`;
};

const About = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [stats, setStats] = useState({
        farmers: 0,
        customers: 0,
        products: 0,
        farmingResources: 0,
    });
    const [services, setServices] = useState([]);
    const [carouselIndex, setCarouselIndex] = useState(0);
    const carouselTimer = useRef(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [fbRes, statsRes, svcRes] = await Promise.all([
                    fetch(`${import.meta.env.VITE_API_URL}/api/feedback?limit=6`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/stats`),
                    fetch(`${import.meta.env.VITE_API_URL}/api/services`),
                ]);

                if (fbRes.ok) {
                    const data = await fbRes.json();
                    setFeedbacks(data.length > 0 ? data : fallbackFeedbacks);
                } else {
                    setFeedbacks(fallbackFeedbacks);
                }

                if (statsRes.ok) {
                    const data = await statsRes.json();
                    setStats(data);
                }

                if (svcRes.ok) {
                    const data = await svcRes.json();
                    setServices(data);
                }
            } catch {
                setFeedbacks(fallbackFeedbacks);
            }
        };
        fetchAll();
    }, []);

    useEffect(() => {
        if (services.length <= 3) return;
        carouselTimer.current = setInterval(() => {
            setCarouselIndex((i) => (i + 1) % services.length);
        }, 4000);
        return () => clearInterval(carouselTimer.current);
    }, [services.length]);

    const pauseCarousel = () => {
        if (carouselTimer.current) clearInterval(carouselTimer.current);
    };

    const visibleServices = (() => {
        if (services.length === 0) return [];
        if (services.length <= 3) return services;
        return [
            services[carouselIndex % services.length],
            services[(carouselIndex + 1) % services.length],
            services[(carouselIndex + 2) % services.length],
        ];
    })();

    const goPrev = () => {
        pauseCarousel();
        setCarouselIndex((i) => (i - 1 + services.length) % services.length);
    };

    const goNext = () => {
        pauseCarousel();
        setCarouselIndex((i) => (i + 1) % services.length);
    };

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
                    <h2>{formatStat(stats.farmers)}</h2>
                    <p>Farmers Connected</p>
                </div>

                <div className="stat">
                    <h2>{formatStat(stats.customers)}</h2>
                    <p>Customers Served</p>
                </div>

                <div className="stat">
                    <h2>{formatStat(stats.products)}</h2>
                    <p>Products Available</p>
                </div>

                <div className="stat">
                    <h2>{formatStat(stats.farmingResources)}</h2>
                    <p>Farming Resources</p>
                </div>

            </div>

            {/* Features Carousel */}
            <div className="about-features">

                <h2>Platform Features</h2>

                {services.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#888' }}>Loading platform features...</p>
                ) : (
                    <div className="features-carousel">
                        {services.length > 3 && (
                            <button
                                className="carousel-btn prev"
                                onClick={goPrev}
                                aria-label="Previous"
                            >
                                ‹
                            </button>
                        )}

                        <div className="feature-grid carousel-track">
                            {visibleServices.map((svc) => (
                                <div className="feature-box" key={svc._id}>
                                    <span>{svc.icon || '🌱'}</span>
                                    <h3>{svc.title}</h3>
                                    <p>{svc.desc}</p>
                                </div>
                            ))}
                        </div>

                        {services.length > 3 && (
                            <button
                                className="carousel-btn next"
                                onClick={goNext}
                                aria-label="Next"
                            >
                                ›
                            </button>
                        )}
                    </div>
                )}

                {services.length > 3 && (
                    <div className="carousel-dots">
                        {services.map((_, i) => (
                            <button
                                key={i}
                                className={`dot ${i === carouselIndex ? 'active' : ''}`}
                                onClick={() => {
                                    pauseCarousel();
                                    setCarouselIndex(i);
                                }}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}

            </div>

            {/* People Feedback */}
            <div className="about-feedback">

                <h2>What People Say</h2>

                <div className="feedback-grid">
                    {feedbacks.map((fb) => {
                        const role = roleLabel(fb.userType);
                        return (
                            <div className="feedback-card" key={fb._id}>
                                <p style={{ color: '#f5a623', marginBottom: '0.5rem' }}>
                                    {'★'.repeat(fb.rating || 5)}{'☆'.repeat(5 - (fb.rating || 5))}
                                </p>
                                <p>"{fb.message}"</p>
                                <h4>- {fb.name}{role && ` (${role})`}</h4>
                            </div>
                        );
                    })}
                </div>

            </div>

        </section>
    );
};

export default About;