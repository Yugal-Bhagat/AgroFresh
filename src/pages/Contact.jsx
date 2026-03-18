import './Contact.css';

const Contact = () => {
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
                  <p>+1 (800) 555-0199<br />Mon–Fri, 9am–6pm</p>
                </div>
              </div>
              
              <div className="info-item">
                <span className="icon">✉️</span>
                <div>
                  <h4>Email Us</h4>
                  <p>support@agrofresh.com<br />hello@agrofresh.com</p>
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
          <form className="contact-form">
            <div className="form-row">
              <div className="form-group">
                <input type="text" id="name" placeholder=" " required />
                <label htmlFor="name">Your Name</label>
              </div>
              <div className="form-group">
                <input type="email" id="email" placeholder=" " required />
                <label htmlFor="email">Email Address</label>
              </div>
            </div>
            
            <div className="form-group">
              <input type="text" id="subject" placeholder=" " required />
              <label htmlFor="subject">Subject</label>
            </div>
            
            <div className="form-group">
              <textarea id="message" rows="5" placeholder=" " required></textarea>
              <label htmlFor="message">Your Message</label>
            </div>
            
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;