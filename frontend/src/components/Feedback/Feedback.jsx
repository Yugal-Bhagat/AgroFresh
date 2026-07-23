import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [form, setForm] = useState({
    name: localStorage.getItem('userName') || '',
    email: '',
    category: '',
    message: '',
  });
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [status, setStatus] = useState({ loading: false, success: '', error: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: '', error: '' });

    if (rating < 1) {
      setStatus({ loading: false, success: '', error: 'Please select a rating.' });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ ...form, rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit feedback');

      setStatus({ loading: false, success: data.message, error: '' });
      setForm({ name: form.name, email: '', category: '', message: '' });
      setRating(5);
    } catch (err) {
      setStatus({ loading: false, success: '', error: err.message });
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>We Value Your Feedback</h2>
          <p>Help us improve AgroFresh by sharing your experience</p>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
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
              />
              <label htmlFor="email">Email (optional)</label>
            </div>
          </div>

          <div className="form-group">
            <select id="category" name="category" value={form.category} onChange={handleChange}>
              <option value="" disabled hidden></option>
              <option value="general">General Feedback</option>
              <option value="product">Product Quality</option>
              <option value="service">Customer Service</option>
              <option value="technical">Technical Issue</option>
              <option value="suggestion">Suggestion</option>
            </select>
            <label htmlFor="category">Feedback Type</label>
          </div>

          <div className="rating-group">
            <label>Your Rating</label>
            <div className="stars">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <span
                    key={index}
                    className="star"
                    onClick={() => setRating(ratingValue)}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                    style={{ cursor: 'pointer' }}
                  >
                    {ratingValue <= (hover || rating) ? '★' : '☆'}
                  </span>
                );
              })}
            </div>
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
            <label htmlFor="message">Your Feedback</label>
          </div>

          {status.success && (
            <p style={{ color: '#2e7d32', fontWeight: 500 }}>{status.success}</p>
          )}
          {status.error && (
            <p style={{ color: 'crimson', fontWeight: 500 }}>{status.error}</p>
          )}

          <button type="submit" className="submit-btn" disabled={status.loading}>
            {status.loading ? 'Submitting...' : 'Submit Feedback'}
          </button>
        </form>

        <div className="feedback-footer">
          <p>Your insights help us grow and serve you better.</p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
