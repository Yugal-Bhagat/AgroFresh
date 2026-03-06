import React from "react";
import "./Service.css";

const services = [
  {
    icon: "📍",
    title: "Nearby Farmer Marketplace",
    desc: "Find farmers and buyers near your location with district wise filtering for easy trading."
  },
  {
    icon: "⭐",
    title: "Product Ratings & Reviews",
    desc: "Users can rate and review products to maintain quality and trust in the marketplace."
  },
  {
    icon: "💳",
    title: "Secure Payment Integration",
    desc: "Safe and secure digital payments for buying agricultural products online."
  },
  {
    icon: "🧾",
    title: "Automatic Bill Generation",
    desc: "Instant invoice generation after order confirmation for transparency."
  },
  {
    icon: "🛒",
    title: "Add to Cart & Order System",
    desc: "Simple shopping cart system to place orders directly from farmers."
  },
  {
    icon: "📞",
    title: "Direct Farmer Contact",
    desc: "Contact farmers directly from each product page for negotiation and queries."
  },
  {
    icon: "🌦",
    title: "Weather Information",
    desc: "Real-time weather updates to help farmers plan their agricultural activities."
  },
  {
    icon: "🌱",
    title: "Farming Guidance",
    desc: "Expert tips and agriculture guidance for better crop production."
  },
  {
    icon: "🏛",
    title: "Government Schemes",
    desc: "Latest government agriculture schemes and benefits for farmers."
  },
  {
    icon: "🧑‍🌾",
    title: "Farmer Verification",
    desc: "Seller verification using Aadhaar to ensure trusted farmers on the platform."
  },
  {
    icon: "📊",
    title: "Buyer & Seller Dashboard",
    desc: "Separate dashboards for buyers and farmers to manage orders and products."
  },
  {
    icon: "📩",
    title: "Query & Support System",
    desc: "Users can ask farming related questions and get expert support."
  }
];

function Service() {
  return (
    <div className="service-page">

      <div className="service-header">
        <h1>AgroFresh Services</h1>
        <p>
          AgroFresh connects farmers and consumers with smart technology,
          providing fresh products, better pricing, and modern farming support.
        </p>
      </div>

      <div className="service-grid">
        {services.map((service, index) => (
          <div className="service-card" key={index}>
            <div className="service-icon">{service.icon}</div>
            <h3>{service.title}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Service;