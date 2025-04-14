import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  const founder = {
    name: "Anurag Mishra",
    position: "Founder & Developer",
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1744232405/Picsart_25-04-10_02-24-34-485_vxaceb.jpg",
    social: {
      instagram: "https://www.instagram.com/its_anurag.m?igsh=MWwwZHNjbTkzMml6Zw==",
      linkedin: "https://www.linkedin.com/in/anurag-mishra-218b94252?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    }
  };

  return (
    <div className="about-us-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About SPSU Marketplace</h1>
          <p>
            Connecting SPSU students through a modern, secure, and convenient platform for buying and selling items
          </p>
        </div>
      </section>

      <section className="about-sections">
        <div className="container">
          <div className="about-section">
            <div className="about-content">
              <h2>Our Mission</h2>
              <p>
                SPSU Marketplace was founded with a simple mission: to create a dedicated platform where SPSU students can buy, sell, and trade items safely and conveniently. We believe in fostering a sustainable campus community where resources are shared and reused.
              </p>
              <p>
                Our platform aims to solve the common challenges students face when trying to buy or sell items on campus, providing a trusted space specifically designed for the SPSU community.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" alt="Students collaborating" />
            </div>
          </div>

          <div className="about-section reverse">
            <div className="about-content">
              <h2>How It Works</h2>
              <p>
                Our platform is designed to be intuitive and user-friendly, making it easy for students to buy and sell items within the campus community.
              </p>
              <ul>
                <li>
                  <strong>For Sellers:</strong> List your items with descriptions, photos, and your asking price. Connect with interested buyers and arrange for exchange.
                </li>
                <li>
                  <strong>For Buyers:</strong> Browse listings, contact sellers, and arrange to meet on campus for safe transactions.
                </li>
                <li>
                  <strong>Community Trust:</strong> All users are verified SPSU students or faculty, creating a safer environment for transactions.
                </li>
                <li>
                  <strong>Convenience:</strong> On-campus exchanges eliminate shipping hassles and make transactions quick and easy.
                </li>
              </ul>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" alt="Students using laptops" />
            </div>
          </div>

          <div className="about-section">
            <div className="about-content">
              <h2>Our Vision</h2>
              <p>
                We envision SPSU Marketplace becoming an integral part of campus life, where students can find everything they need—from textbooks and electronics to furniture and clothing—without leaving campus or paying retail prices.
              </p>
              <p>
                By promoting reuse and community exchange, we're not only making student life more affordable but also contributing to sustainability efforts by giving items a second life rather than sending them to landfills.
              </p>
              <p>
                Our long-term goal is to expand the platform to include additional features such as service exchanges, event tickets, and campus-specific resources, creating a comprehensive marketplace tailored to the unique needs of the SPSU community.
              </p>
            </div>
            <div className="about-image">
              <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1050&q=80" alt="Team working together" />
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet the Developer</h2>
            <p>The mind behind SPSU Marketplace, working to create the best possible experience for our community</p>
          </div>

          <div className="founder-container">
            <div className="team-member">
              <div className="team-member-img">
                <img src={founder.image} alt={founder.name} />
              </div>
              <div className="team-member-info">
                <h3>{founder.name}</h3>
                <p>{founder.position}</p>
                <div className="social-links">
                  <a href={founder.social.instagram} target="_blank" rel="noopener noreferrer" className="social-link instagram-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                    </svg>
                  </a>
                  <a href={founder.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link linkedin-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20">
                      <path fill="currentColor" d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;