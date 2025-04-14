import React from 'react';
import { Link } from 'react-router-dom';
import './AboutSection.css';

const AboutSection = () => {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-img">
          <img 
            src="https://res.cloudinary.com/durayngkx/image/upload/v1699607851/gzikb6cxygcwcrjvnm65.jpg" 
            alt="About SPSU Marketplace" 
          />
        </div>
        <div className="about-text">
          <span className="about-subtitle">About Our Platform</span>
          <h2>We Are SPSU Marketplace</h2>
          <p>
            Welcome to SPSU Marketplace, where buying and selling converge to enhance the university
            experience. We're a community-driven platform, connecting students, faculty, and staff in a
            convenient, sustainable, and trusted space.
          </p>
          
          <div className="about-features">
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Campus-Focused: Tailored specifically for SPSU students and faculty</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Convenience: Easy exchanges on campus</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Trust: Deal with verified members of the SPSU community</div>
            </div>
            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div className="feature-text">Sustainability: Give items a second life and reduce waste</div>
            </div>
          </div>
          
          <Link to="/about-us" className="about-cta">Learn More</Link>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 