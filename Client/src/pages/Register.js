import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope, FaPhone, FaUserPlus } from 'react-icons/fa';
import './Auth.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const particlesRef = useRef(null);

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      navigate('/home'); // Redirect to home if already logged in
    }
  }, [navigate]);

  // Add 3D rotation effect based on mouse movement
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 25;
      const rotateY = (centerX - x) / 25;
      
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Create floating particles
  useEffect(() => {
    const particlesContainer = particlesRef.current;
    if (!particlesContainer) return;

    // Clear any existing particles
    particlesContainer.innerHTML = '';

    // Create random particles
    const particleCount = 20;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('span');
      particle.classList.add('particle');

      // Random positions
      const posX = Math.random() * 100; // percentage
      const posY = Math.random() * 100; // percentage

      // Random sizes
      const size = Math.random() * 5 + 2; // 2-7px

      // Random animation durations and delays
      const duration = Math.random() * 10 + 10; // 10-20s
      const delay = Math.random() * 5; // 0-5s

      // Apply styles
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = Math.random() * 0.5 + 0.1;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;

      particles.push(particle);
      particlesContainer.appendChild(particle);
    }

    return () => {
      particles.forEach(particle => {
        if (particlesContainer.contains(particle)) {
          particlesContainer.removeChild(particle);
        }
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          phone
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Save user data and token to localStorage
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect to home page
      navigate('/home');
      
    } catch (error) {
      setError(error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* 3D background elements */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="particles" ref={particlesRef}></div>
      
      <div className="auth-container">
        <div className="auth-card register-card" ref={cardRef}>
          <div className="card-shine"></div>
          <div className="auth-card-content">
            <div className="auth-logo">
              <div className="logo-icon">
                <span className="logo-text">SPSU</span>
                <span className="logo-highlight">Marketplace</span>
              </div>
            </div>
            
            <div className="auth-header">
              <h1>Create Account</h1>
              <p>Join the SPSU Marketplace community</p>
            </div>
            
            {error && (
              <div className="auth-error">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <div className="input-icon-wrapper">
                  <FaUser className="input-icon" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="input-focus-effect"></div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-icon-wrapper">
                  <FaEnvelope className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <div className="input-focus-effect"></div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">Phone Number (optional)</label>
                <div className="input-icon-wrapper">
                  <FaPhone className="input-icon" />
                  <input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <div className="input-focus-effect"></div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="input-focus-effect"></div>
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-icon-wrapper">
                  <FaLock className="input-icon" />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <div className="input-focus-effect"></div>
                </div>
              </div>
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    Create Account <FaUserPlus className="btn-icon" />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <div className="auth-links">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link register-link">
                  Login Now
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 