import React from 'react';
import { Link } from 'react-router-dom';
import './TermsConditions.css';

const TermsConditions = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="terms-page">
      
      <div className="terms-hero">
        <h1>Terms & Conditions</h1>
        <p>Last Updated: June 15, 2023</p>
      </div>
      
      <div className="terms-container">
        <div className="terms-navigation">
          <ul>
            <li><a href="#overview">1. Overview</a></li>
            <li><a href="#accounts">2. Accounts</a></li>
            <li><a href="#listings">3. Listings</a></li>
            <li><a href="#transactions">4. Transactions</a></li>
            <li><a href="#prohibited">5. Prohibited Items</a></li>
            <li><a href="#privacy">6. Privacy</a></li>
            <li><a href="#termination">7. Termination</a></li>
            <li><a href="#changes">8. Changes to Terms</a></li>
            <li><a href="#contact">9. Contact Us</a></li>
          </ul>
        </div>
        
        <div className="terms-content">
          <section id="overview">
            <h2>1. Overview</h2>
            <p>Welcome to SPSU Marketplace, a platform designed exclusively for SPSU students to buy, sell, and exchange goods and services within the campus community. By using our services, you agree to these Terms and Conditions.</p>
            <p>These terms constitute a legally binding agreement between you and SPSU Marketplace regarding your use of our website, mobile applications, and related services (collectively, the "Services").</p>
          </section>
          
          <section id="accounts">
            <h2>2. Accounts</h2>
            <p>To use SPSU Marketplace, you must:</p>
            <ul>
              <li>Be a currently enrolled student at SPSU</li>
              <li>Register using your SPSU email address</li>
              <li>Be at least 18 years of age</li>
              <li>Provide accurate and complete information</li>
              <li>Keep your account information secure</li>
            </ul>
            <p>You are responsible for all activities that occur under your account. If you suspect unauthorized access, notify us immediately.</p>
          </section>
          
          <section id="listings">
            <h2>3. Listings</h2>
            <p>When creating listings on SPSU Marketplace, you must:</p>
            <ul>
              <li>Provide accurate descriptions of items or services</li>
              <li>Include clear images that represent the actual condition</li>
              <li>Set reasonable prices</li>
              <li>Respond promptly to inquiries</li>
              <li>Update or remove listings when items are no longer available</li>
            </ul>
            <p>SPSU Marketplace reserves the right to remove any listing that violates our policies or these Terms.</p>
          </section>
          
          <section id="transactions">
            <h2>4. Transactions</h2>
            <p>SPSU Marketplace is a platform that connects buyers and sellers. We do not:</p>
            <ul>
              <li>Take possession of items being sold</li>
              <li>Transfer funds between users</li>
              <li>Guarantee the quality of items or services</li>
              <li>Mediate disputes between users</li>
            </ul>
            <p>We strongly recommend meeting in public, well-lit areas on campus for exchanges and using secure payment methods. SPSU Marketplace is not responsible for any losses resulting from transactions between users.</p>
          </section>
          
          <section id="prohibited">
            <h2>5. Prohibited Items</h2>
            <p>The following items and services are strictly prohibited on SPSU Marketplace:</p>
            <ul>
              <li>Illegal goods or services</li>
              <li>Weapons or dangerous materials</li>
              <li>Alcohol, tobacco, or drugs</li>
              <li>Counterfeit or stolen items</li>
              <li>Academic materials for the purpose of plagiarism</li>
              <li>Items that violate intellectual property rights</li>
              <li>Services that violate university policies</li>
            </ul>
            <p>Violation of these prohibitions may result in immediate account termination and potential reporting to university authorities.</p>
          </section>
          
          <section id="privacy">
            <h2>6. Privacy</h2>
            <p>Your privacy is important to us. Our <Link to="/privacy">Privacy Policy</Link> explains how we collect, use, and protect your information.</p>
            <p>By using SPSU Marketplace, you consent to our data practices as described in the Privacy Policy.</p>
          </section>
          
          <section id="termination">
            <h2>7. Termination</h2>
            <p>SPSU Marketplace may terminate or suspend your account at any time for violations of these Terms or for any other reason at our discretion.</p>
            <p>You may also terminate your account at any time by following the instructions in your account settings.</p>
            <p>Upon termination, your right to use the Services will immediately cease.</p>
          </section>
          
          <section id="changes">
            <h2>8. Changes to Terms</h2>
            <p>We may update these Terms at any time. We will notify you of any material changes via email or through a notice on our website.</p>
            <p>Your continued use of SPSU Marketplace after changes constitutes acceptance of the updated Terms.</p>
          </section>
          
          <section id="contact">
            <h2>9. Contact Us</h2>
            <p>If you have any questions about these Terms & Conditions, please contact us at:</p>
            <p>Email: support@spsumarketplace.com</p>
            <p>Address: SPSU Campus, Student Services Building, Room 205</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsConditions; 