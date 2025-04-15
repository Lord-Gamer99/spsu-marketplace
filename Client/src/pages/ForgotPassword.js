import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaKey, FaArrowLeft, FaCheck } from 'react-icons/fa';
import './Auth.css';

// API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Set new password
  
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const particlesRef = useRef(null);

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
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
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

  // Helper function to get base API URL
  const getApiUrl = () => {
    // Use environment variable for API URL with /api path
    return `${API_URL}/api`;
  };

  const sendResetLink = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Verify email format first
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }
      
      // Debug info to show what API URL we're using
      const apiUrl = getApiUrl();
      console.log('Using API URL:', apiUrl);
      
      try {
        const response = await fetch(`${apiUrl}/users/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error sending reset code');
        }
        
        console.log('Password reset request sent successfully');
        setSuccess('Verification code sent. Please check the server console for the OTP code and enter it below.');
        setStep(2);
      } catch (fetchError) {
        console.error('API Error:', fetchError);
        
        // Only use fallback if the server is unreachable (network error)
        if (fetchError instanceof TypeError && fetchError.message.includes('network')) {
          // Fallback to local OTP generation if server is unreachable
          const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
          localStorage.setItem(`otp_${email}`, generatedOTP);
          localStorage.setItem(`otp_${email}_timestamp`, Date.now().toString());
          
          console.log('============================================');
          console.log(`FALLBACK MODE: OTP for ${email}: ${generatedOTP}`);
          console.log('============================================');
          
          setSuccess('Server unreachable. Using fallback mode. Check browser console (F12) for OTP code.');
          setStep(2);
        } else {
          // If it's a server-side error, just show the error
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Error in reset flow:', error);
      setError(error.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError('');
    setLoading(true);
    
    try {
      // Debug info to show what API URL we're using
      const apiUrl = getApiUrl();
      console.log('Using API URL:', apiUrl);
      
      try {
        const response = await fetch(`${apiUrl}/users/verify-reset-code`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email,
            resetCode: otp 
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Invalid verification code');
        }
        
        setSuccess('Verification successful. Please set your new password.');
        setStep(3);
      } catch (fetchError) {
        console.error('API Error:', fetchError);
        
        // Only use fallback if the server is unreachable (network error)
        if (fetchError instanceof TypeError && fetchError.message.includes('network')) {
          // Fallback to local verification if server is unreachable
          const storedOTP = localStorage.getItem(`otp_${email}`);
          const timestamp = parseInt(localStorage.getItem(`otp_${email}_timestamp`) || '0');
          
          if (!storedOTP) {
            throw new Error('Verification code not found or has expired. Please request a new code.');
          }
          
          const currentTime = Date.now();
          const fifteenMinutes = 15 * 60 * 1000;
          
          if (currentTime - timestamp > fifteenMinutes) {
            localStorage.removeItem(`otp_${email}`);
            localStorage.removeItem(`otp_${email}_timestamp`);
            throw new Error('Verification code has expired. Please request a new code.');
          }
          
          if (otp !== storedOTP) {
            throw new Error('Invalid verification code. Please try again.');
          }
          
          setSuccess('Verification successful. Please set your new password. (Fallback mode)');
          setStep(3);
        } else {
          // If it's a server-side error, just show the error
          throw fetchError;
        }
      }
    } catch (error) {
      console.error('Error in verification flow:', error);
      setError(error.message || 'Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Debug info to show what API URL we're using
      const apiUrl = getApiUrl();
      console.log('Using API URL:', apiUrl);
      
      try {
        const response = await fetch(`${apiUrl}/users/reset-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            resetCode: otp,
            newPassword
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to reset password');
        }
        
        // Clear any local OTP data
        localStorage.removeItem(`otp_${email}`);
        localStorage.removeItem(`otp_${email}_timestamp`);
        
        setSuccess('Password reset successfully!');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (fetchError) {
        console.error('API Error:', fetchError);
        
        // Fallback to local storage if server is unreachable
        const storedOTP = localStorage.getItem(`otp_${email}`);
        
        if (!storedOTP || otp !== storedOTP) {
          throw new Error('Your session has expired. Please restart the password reset process.');
        }
        
        // Store reset info in localStorage (for demo purposes only)
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex(user => user.email === email);
        
        if (userIndex !== -1) {
          users[userIndex].password = newPassword;
        } else {
          users.push({ email, password: newPassword });
        }
        
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem(`otp_${email}`);
        localStorage.removeItem(`otp_${email}_timestamp`);
        
        setSuccess('Password reset successfully! (Fallback mode)');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Error in reset password flow:', error);
      setError(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!email) {
        setError('Please enter your email address');
        return;
      }
      sendResetLink();
    } else if (step === 2) {
      if (!otp) {
        setError('Please enter the verification code');
        return;
      }
      verifyOTP();
    } else if (step === 3) {
      resetPassword();
    }
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
      setSuccess('');
    } else {
      navigate('/login');
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
        <div className="auth-card" ref={cardRef}>
          <div className="card-shine"></div>
          <div className="auth-card-content">
            <div className="auth-logo">
              <div className="logo-icon">
                <span className="logo-text">SPSU</span>
                <span className="logo-highlight">Marketplace</span>
              </div>
            </div>
            
            <div className="auth-header">
              <button onClick={goBack} className="back-button">
                <FaArrowLeft />
              </button>
              <h1>Reset Password</h1>
              <p>
                {step === 1 && 'Enter your email to receive a verification code'}
                {step === 2 && 'Enter the verification code you received'}
                {step === 3 && 'Create a new password for your account'}
              </p>
            </div>
            
            {error && (
              <div className="auth-error">
                <span className="error-icon">!</span>
                {error}
              </div>
            )}
            
            {success && (
              <div className="auth-success">
                <span className="success-icon"><FaCheck /></span>
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              {step === 1 && (
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-icon-wrapper">
                    <FaEnvelope className="input-icon" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <div className="input-focus-effect"></div>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="form-group">
                  <label htmlFor="otp">Verification Code</label>
                  <div className="otp-input-container">
                    <input
                      id="otp"
                      type="text"
                      placeholder="Enter verification code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="otp-input"
                    />
                  </div>
                  <div className="resend-otp">
                    <button 
                      type="button" 
                      className="resend-btn"
                      onClick={sendResetLink}
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <>
                  <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <div className="input-icon-wrapper">
                      <FaKey className="input-icon" />
                      <input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <div className="input-focus-effect"></div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-icon-wrapper">
                      <FaKey className="input-icon" />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <div className="input-focus-effect"></div>
                    </div>
                  </div>
                </>
              )}
              
              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-spinner"></span>
                ) : (
                  <>
                    {step === 1 && 'Send Verification Code'}
                    {step === 2 && 'Verify Code'}
                    {step === 3 && 'Reset Password'}
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-links">
              <p>
                Remembered your password?{' '}
                <Link to="/login" className="auth-link">
                  Back to Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 