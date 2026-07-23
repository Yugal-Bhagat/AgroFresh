import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send message');

      setStatus({ loading: false, success: data.message || 'Message sent!', error: '' });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus({ loading: false, success: '', error: err.message });
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        {/* Left side – Info */}
        <div className="contact-info">
          <div className="info-content">
            <h2>Get in Touch</h2>
            <p className="subtitle">We'd love to hear from you. Whether you're a farmer, buyer, or partner, our team is ready to assist.</p>

            <div className="info-items">
              <div className="info-item">
                <span className="icon">📍</span>
                <div>
                  <h4>Visit Us</h4>
                  <p>AgroFresh Headquarters<br />123 Greenway Road, Farmington, AG 54321</p>
                </div>
              </div>

              <div className="info-item">
                <span className="icon">📞</span>
                <div>
                  <h4>Call Us</h4>
                  <p>+91 9399241821<br />Mon–Fri, 9am–6pm</p>
                </div>
              </div>

              <div className="info-item">
                <span className="icon">✉️</span>
                <div>
                  <h4>Email Us</h4>
                  <p>khushinema22@gmail.com</p>
                </div>
              </div>
            </div>

            <div className="social-links">
              <a href="#" aria-label="Facebook">🌾</a>
              <a href="#" aria-label="Twitter">🌿</a>
              <a href="#" aria-label="Instagram">🌱</a>
              <a href="#" aria-label="LinkedIn">🍃</a>
            </div>
          </div>
        </div>

        {/* Right side – Form */}
        <div className="contact-form-container">
          <h3>Send a Message</h3>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="form-group">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder=" "
                required
              />
              <label htmlFor="subject">Subject</label>
            </div>

            <div className="form-group">
              <textarea
                id="message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                placeholder=" "
                required
              ></textarea>
              <label htmlFor="message">Your Message</label>
            </div>

            {status.success && (
              <p style={{ color: '#2e7d32', fontWeight: 500 }}>{status.success}</p>
            )}
            {status.error && (
              <p style={{ color: 'crimson', fontWeight: 500 }}>{status.error}</p>
            )}

            <button type="submit" className="submit-btn" disabled={status.loading}>
              {status.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
