import React from 'react';
import './Services.css';

const Services = () => {
  const services = [
    {
      icon: "https://res.cloudinary.com/durayngkx/image/upload/v1744221127/First_Customer_saqhaa.png",
      title: "Be Our First Customer",
      description: "Join our growing community of users and be among the first to experience our platform."
    },
    {
      icon: "https://res.cloudinary.com/durayngkx/image/upload/v1744221127/Secured_milsff.png",
      title: "Secure Transactions",
      description: "We prioritize your safety with secure transaction processes and verification systems."
    },
    {
      icon: "https://res.cloudinary.com/durayngkx/image/upload/v1744221126/Customer-experience_spe0nm.png",
      title: "Great Experience",
      description: "Enjoy a seamless, user-friendly experience designed with your needs in mind."
    },
    {
      icon: "https://res.cloudinary.com/durayngkx/image/upload/v1744221126/Happy_Customer_ykt8su.png",
      title: "Customer Satisfaction",
      description: "Your happiness is our priority. We're committed to providing excellent service."
    }
  ];

  return (
    <section className="services">
      <div className="services-container">
        <div className="services-heading">
          <h2>Why Choose Us</h2>
          <p>SPSU Marketplace offers a range of benefits to make your buying and selling experience exceptional.</p>
        </div>
        
        {services.map((service, index) => (
          <div className="service-item" key={index}>
            <div className="service-icon">
              <img src={service.icon} alt={service.title} />
            </div>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services; 