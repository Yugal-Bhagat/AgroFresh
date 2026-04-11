import React from 'react';
import { Link } from 'react-router-dom';
import './TermsConditions.css';

const TermsConditions = () => {
  return (
    <div className="terms-page">
      <div className="terms-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Terms & Conditions</span>
        </div>
        <h1>Terms & Conditions</h1>
        <p className="last-updated">Last Updated: March 17, 2026</p>

        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the AgroFresh platform, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <p>You must be at least 18 years old to use our services. By agreeing to these terms, you represent that you are of legal age.</p>
        </section>

        <section>
          <h2>3. Account Registration</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>
        </section>

        <section>
          <h2>4. Product Listings & Orders</h2>
          <p>Farmers list products for sale; AgroFresh facilitates the transaction. We do not guarantee the accuracy of listings but encourage farmers to provide truthful information. All sales are final unless the product is damaged or not as described.</p>
        </section>

        <section>
          <h2>5. Payments</h2>
          <p>All payments are processed securely. You agree to pay all charges incurred. Prices are in Indian Rupees and inclusive of applicable taxes.</p>
        </section>

        <section>
          <h2>6. Shipping & Delivery</h2>
          <p>Delivery times are estimates; we are not liable for delays beyond our control. Risk of loss passes to you upon delivery.</p>
        </section>

        <section>
          <h2>7. Returns & Refunds</h2>
          <p>If you receive a damaged or incorrect product, contact us within 48 hours. Refunds will be processed after verification.</p>
        </section>

        <section>
          <h2>8. User Conduct</h2>
          <p>You agree not to use the platform for any unlawful purpose, to harass others, or to impersonate any person or entity.</p>
        </section>

        <section>
          <h2>9. Intellectual Property</h2>
          <p>All content on this site – including text, graphics, logos, and software – is the property of AgroFresh and protected by copyright laws.</p>
        </section>

        <section>
          <h2>10. Limitation of Liability</h2>
          <p>AgroFresh shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services.</p>
        </section>

        <section>
          <h2>11. Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be resolved in the courts of [City, State].</p>
        </section>

        <section>
          <h2>12. Changes to Terms</h2>
          <p>We may update these terms. Continued use of the site after changes constitutes acceptance.</p>
        </section>

        <section>
          <h2>13. Contact</h2>
          <p>For questions, email <a href="mailto:legal@agrofresh.com">legal@agrofresh.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;