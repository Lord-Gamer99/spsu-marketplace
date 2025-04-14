import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSignOutAlt, FaKey } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    
    if (!storedUserInfo) {
      navigate('/login');
      return;
    }
    
    const parsedUserInfo = JSON.parse(storedUserInfo);
    
    // Fetch user profile using the token
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${parsedUserInfo.token}`
          }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user profile');
        }
        
        setUserInfo(data);
        
        // Set initial form data
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          address: {
            street: data.address?.street || '',
            city: data.address?.city || '',
            state: data.address?.state || '',
            pincode: data.address?.pincode || ''
          }
        });
        
        setLoading(false);
      } catch (error) {
        setError(error.message || 'An error occurred while fetching profile');
        setLoading(false);
        
        // If token is invalid or expired, redirect to login
        if (error.message.includes('token') || error.message.includes('authorized')) {
          localStorage.removeItem('userInfo');
          navigate('/login');
        }
      }
    };
    
    fetchUserProfile();
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if the user is trying to change them
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
      
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }
      
      if (!formData.currentPassword) {
        setError('Current password is required to set a new password');
        return;
      }
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const storedUserInfo = JSON.parse(localStorage.getItem('userInfo'));
      
      const updatedUser = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          pincode: formData.address.pincode
        }
      };
      
      // Only include password fields if the user is changing password
      if (formData.newPassword) {
        updatedUser.password = formData.newPassword;
        // In a real implementation, we would send the current password for verification
      }
      
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUserInfo.token}`
        },
        body: JSON.stringify(updatedUser)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      // Update stored user info with new data and token
      localStorage.setItem('userInfo', JSON.stringify({
        ...data,
        token: data.token || storedUserInfo.token
      }));
      
      setUserInfo(data);
      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      setLoading(false);
    } catch (error) {
      setError(error.message || 'An error occurred while updating profile');
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };
  
  if (loading && !userInfo) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h1>{editMode ? 'Edit Profile' : 'My Profile'}</h1>
            
            {!editMode && (
              <div className="profile-actions">
                <button 
                  className="edit-button"
                  onClick={() => setEditMode(true)}
                >
                  <FaEdit /> Edit Profile
                </button>
                <button 
                  className="logout-button"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
          
          {error && <div className="profile-error">{error}</div>}
          {successMessage && <div className="profile-success">{successMessage}</div>}
          
          {editMode ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <div className="form-group">
                <label>
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaPhone /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="address-section">
                <h3><FaMapMarkerAlt /> Address Information</h3>
                
                <div className="form-group">
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Street address, apartment, etc."
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                    placeholder="Postal / ZIP code"
                  />
                </div>
              </div>
              
              <div className="password-section">
                <h3><FaKey /> Change Password (Optional)</h3>
                
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </div>
                
                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="save-button"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-group">
                <span className="detail-icon"><FaUser /></span>
                <div className="detail-content">
                  <h3>Full Name</h3>
                  <p>{userInfo?.name}</p>
                </div>
              </div>
              
              <div className="detail-group">
                <span className="detail-icon"><FaEnvelope /></span>
                <div className="detail-content">
                  <h3>Email</h3>
                  <p>{userInfo?.email}</p>
                </div>
              </div>
              
              {userInfo?.phone && (
                <div className="detail-group">
                  <span className="detail-icon"><FaPhone /></span>
                  <div className="detail-content">
                    <h3>Phone Number</h3>
                    <p>{userInfo.phone}</p>
                  </div>
                </div>
              )}
              
              {userInfo?.address && (userInfo.address.street || userInfo.address.city || userInfo.address.state || userInfo.address.pincode) && (
                <div className="detail-group">
                  <span className="detail-icon"><FaMapMarkerAlt /></span>
                  <div className="detail-content">
                    <h3>Address</h3>
                    <p>
                      {userInfo.address.street && <span>{userInfo.address.street}<br /></span>}
                      {(userInfo.address.city || userInfo.address.state) && (
                        <span>
                          {userInfo.address.city}{userInfo.address.city && userInfo.address.state ? ', ' : ''}
                          {userInfo.address.state}
                          <br />
                        </span>
                      )}
                      {userInfo.address.pincode && <span>PIN: {userInfo.address.pincode}</span>}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="account-info">
                <h3>Account Information</h3>
                <p>
                  <strong>Role:</strong> {userInfo?.role === 'admin' ? 'Administrator' : 'User'}<br />
                  <strong>Member Since:</strong> {new Date(userInfo?.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 