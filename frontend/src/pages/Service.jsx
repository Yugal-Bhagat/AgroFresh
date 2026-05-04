import React, { useEffect, useState } from "react";
import "./Service.css";

function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/services");
        if (!res.ok) throw new Error("Failed to load services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  return (
    <div className="service-page">

      <div className="service-header">
        <h1>AgroFresh Services</h1>
        <p>
          AgroFresh connects farmers and consumers with smart technology,
          providing fresh products, better pricing, and modern farming support.
        </p>
      </div>

      {loading && <p style={{ textAlign: "center" }}>Loading services...</p>}
      {error && <p style={{ textAlign: "center", color: "crimson" }}>{error}</p>}

      <div className="service-grid">
        {services.map((service) => (
          <div className="service-card" key={service._id}>
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
