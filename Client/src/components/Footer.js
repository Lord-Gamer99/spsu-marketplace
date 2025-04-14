import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const location = useLocation();
  
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollToContact = () => {
    // Navigate to home page if not already there
    if (window.location.pathname !== '/home') {
      // We'll handle the scrolling after navigation in the ContactSection component's useEffect
      return true;
    }
    
    // If already on home page, scroll to contact section
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      return false; // Prevent default Link behavior if already on home page
    }
    return true;
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">SPSU Marketplace</div>
          <p className="footer-description">
            A platform for SPSU students to buy and sell items within the university community. Connect, trade, and save with fellow students.
          </p>
          <div className="social-icons">
            <a href="https://www.instagram.com/its_anurag.m?igsh=MWwwZHNjbTkzMml6Zw==" className="social-icon instagram" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18">
                <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/anurag-mishra-218b94252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="social-icon linkedin" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18">
                <path fill="currentColor" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">Quick Links</h3>
          <ul>
            <li><Link to="/home" onClick={scrollToTop}>Home</Link></li>
            <li><Link to="/about-us" onClick={scrollToTop}>About Us</Link></li>
            <li><Link to="/contact" onClick={scrollToTop}>Contact Us</Link></li>
            <li><Link to="/terms" onClick={scrollToTop}>Terms & Conditions</Link></li>
            <li><Link to="/privacy" onClick={scrollToTop}>Privacy Policy</Link></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3 className="footer-title">Categories</h3>
          <ul>
            <li><Link to="/products?category=electronics" onClick={scrollToTop}>Electronics</Link></li>
            <li><Link to="/products?category=books" onClick={scrollToTop}>Books</Link></li>
            <li><Link to="/products?category=furniture" onClick={scrollToTop}>Furniture</Link></li>
            <li><Link to="/products?category=clothing" onClick={scrollToTop}>Clothing</Link></li>
            <li><Link to="/products?category=accessories" onClick={scrollToTop}>Accessories</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Contact Us</h3>
          <div className="contact-info">
            <i className="fas fa-map-marker-alt">📍</i>
            <div className="contact-detail">Sir Padampat Singhania University, Udaipur, Rajasthan, India</div>
          </div>
          <div className="contact-info">
            <i className="fas fa-envelope">✉️</i>
            <div className="contact-detail">contact@spsumarketplace.com</div>
          </div>
          <div className="contact-info">
            <i className="fas fa-phone">📞</i>
            <div className="contact-detail">+91 9461132447</div>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SPSU Marketplace. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 