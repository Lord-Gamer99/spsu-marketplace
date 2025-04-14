import React from 'react';
import { Link } from 'react-router-dom';
import './Privacy.css';

const Privacy = () => {
  // Scroll to top when component mounts
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page">
      
      <div className="privacy-hero">
        <h1>Privacy Policy</h1>
        <p>Last Updated: June 15, 2023</p>
      </div>
      
      <div className="privacy-container">
        <div className="privacy-navigation">
          <ul>
            <li><a href="#introduction">1. Introduction</a></li>
            <li><a href="#information">2. Information We Collect</a></li>
            <li><a href="#usage">3. How We Use Information</a></li>
            <li><a href="#sharing">4. Information Sharing</a></li>
            <li><a href="#security">5. Data Security</a></li>
            <li><a href="#choices">6. Your Choices</a></li>
            <li><a href="#cookies">7. Cookies & Technologies</a></li>
            <li><a href="#changes">8. Changes to Policy</a></li>
            <li><a href="#contact">9. Contact Us</a></li>
          </ul>
        </div>
        
        <div className="privacy-content">
          <section id="introduction">
            <h2>1. Introduction</h2>
            <p>At SPSU Marketplace, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
            <p>By accessing or using SPSU Marketplace, you consent to the practices described in this policy. This policy applies to all users of our website, mobile applications, and related services.</p>
          </section>
          
          <section id="information">
            <h2>2. Information We Collect</h2>
            <p>We collect several types of information from and about users of our platform, including:</p>
            <ul>
              <li><strong>Personal Information:</strong> Name, SPSU email address, student ID, profile picture, and contact information</li>
              <li><strong>Account Information:</strong> Login credentials and account preferences</li>
              <li><strong>Transaction Information:</strong> Records of items you list, buy, or express interest in</li>
              <li><strong>Communication Information:</strong> Messages exchanged with other users through our platform</li>
              <li><strong>Technical Information:</strong> IP address, device information, browser type, and usage data</li>
              <li><strong>Location Information:</strong> General location based on IP address and specific location if you opt to share it</li>
            </ul>
          </section>
          
          <section id="usage">
            <h2>3. How We Use Information</h2>
            <p>We use your information for various purposes, including to:</p>
            <ul>
              <li>Create and maintain your account</li>
              <li>Provide, personalize, and improve our services</li>
              <li>Facilitate transactions between users</li>
              <li>Communicate with you about your account, listings, or purchases</li>
              <li>Send updates, security alerts, and support messages</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Prevent, detect, and address fraud, security issues, or technical problems</li>
              <li>Enforce our terms of service and other policies</li>
            </ul>
          </section>
          
          <section id="sharing">
            <h2>4. Information Sharing</h2>
            <p>We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>With Other Users:</strong> When you create listings or interact with other users, certain information from your profile is visible to them</li>
              <li><strong>Service Providers:</strong> With third-party vendors who provide services on our behalf</li>
              <li><strong>Legal Compliance:</strong> When required by law, legal process, or to protect our rights</li>
              <li><strong>University Officials:</strong> In cases of policy violations or safety concerns</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
            <p>We do not sell your personal information to third parties for marketing purposes.</p>
          </section>
          
          <section id="security">
            <h2>5. Data Security</h2>
            <p>We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. These measures include:</p>
            <ul>
              <li>Encryption of sensitive data</li>
              <li>Secure user authentication</li>
              <li>Regular security assessments</li>
              <li>Limited access to personal information by our staff</li>
            </ul>
            <p>However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.</p>
          </section>
          
          <section id="choices">
            <h2>6. Your Choices</h2>
            <p>You have several choices regarding your personal information:</p>
            <ul>
              <li><strong>Account Information:</strong> You can review and update your account information in your profile settings</li>
              <li><strong>Communication Preferences:</strong> You can opt out of non-essential communications</li>
              <li><strong>Privacy Settings:</strong> You can adjust privacy settings to control what information is visible to others</li>
              <li><strong>Account Deletion:</strong> You can request deletion of your account by contacting us</li>
            </ul>
          </section>
          
          <section id="cookies">
            <h2>7. Cookies & Technologies</h2>
            <p>We use cookies and similar technologies to enhance your experience, understand usage patterns, and deliver personalized content.</p>
            <p>Types of cookies we use:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the platform to function properly</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Analytical Cookies:</strong> Help us understand how users interact with our platform</li>
              <li><strong>Authentication Cookies:</strong> Recognize you when you log in</li>
            </ul>
            <p>You can manage cookie preferences through your browser settings, but disabling certain cookies may affect functionality.</p>
          </section>
          
          <section id="changes">
            <h2>8. Changes to Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
            <p>We will notify you of any material changes through email or a notice on our platform. Your continued use after the changes indicates your acceptance of the revised Privacy Policy.</p>
          </section>
          
          <section id="contact">
            <h2>9. Contact Us</h2>
            <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
            <p>Email: privacy@spsumarketplace.com</p>
            <p>Address: SPSU Campus, Student Services Building, Room 205</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy; 