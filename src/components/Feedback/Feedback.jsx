import React, { useState } from 'react';
import './Feedback.css';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="feedback-page">
      <div className="feedback-container">
        <div className="feedback-header">
          <h2>We Value Your Feedback</h2>
          <p>Help us improve AgroFresh by sharing your experience</p>
        </div>

        <form className="feedback-form">
          <div className="form-row">
            <div className="form-group">
              <input type="text" id="name" placeholder=" " required />
              <label htmlFor="name">Your Name</label>
            </div>

            <div className="form-group">
              <input type="email" id="email" placeholder=" " />
              <label htmlFor="email">Email (optional)</label>
            </div>
          </div>

          <div className="form-group">
            <select id="category" defaultValue="">
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
                  >
                    {ratingValue <= (hover || rating) ? '★' : '☆'}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <textarea id="message" rows="5" placeholder=" " required></textarea>
            <label htmlFor="message">Your Feedback</label>
          </div>

          <button type="submit" className="submit-btn">Submit Feedback</button>
        </form>

        <div className="feedback-footer">
          <p>Your insights help us grow and serve you better.</p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;