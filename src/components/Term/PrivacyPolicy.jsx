import React from 'react';
import { Link } from 'react-router-dom';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <div className="breadcrumb">
          <Link to="/">Home</Link> &gt; <span>Privacy Policy</span>
        </div>
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: March 17, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to AgroFresh. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website or use our services.</p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>We may collect personal identification information (name, email address, phone number, etc.) when you register on our site, place an order, or fill out a form. We also collect non-personal data such as browser type, device information, and usage data through cookies.</p>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process transactions and deliver products</li>
            <li>Improve customer service and website experience</li>
            <li>Send periodic emails regarding your order or other products and services</li>
            <li>Administer promotions, surveys, or other site features</li>
          </ul>
        </section>

        <section>
          <h2>4. Data Protection</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. All supplied sensitive/credit information is transmitted via Secure Socket Layer (SSL) technology and encrypted in our database.</p>
        </section>

        <section>
          <h2>5. Sharing Your Information</h2>
          <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except to trusted third parties who assist us in operating our website, conducting our business, or servicing you, as long as those parties agree to keep this information confidential.</p>
        </section>

        <section>
          <h2>6. Cookies</h2>
          <p>We use cookies to enhance your experience, analyze site traffic, and understand where our visitors come from. You can choose to disable cookies through your browser settings.</p>
        </section>

        <section>
          <h2>7. Your Consent</h2>
          <p>By using our site, you consent to our privacy policy.</p>
        </section>

        <section>
          <h2>8. Changes to Our Privacy Policy</h2>
          <p>We may update this policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated revision date.</p>
        </section>

        <section>
          <h2>9. Contacting Us</h2>
          <p>If you have questions regarding this privacy policy, you may contact us at <a href="mailto:support@agrofresh.com">support@agrofresh.com</a>.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;