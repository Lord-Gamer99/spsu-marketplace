import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Debug = () => {
  const [dbStatus, setDbStatus] = useState(null);
  const [authStatus, setAuthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [wishlistStatus, setWishlistStatus] = useState(null);
  const [cartStatus, setCartStatus] = useState(null);

  // Get auth token from localStorage
  const getToken = () => localStorage.getItem('token');
  
  // Check if user is logged in
  const isAuthenticated = !!localStorage.getItem('user') && !!getToken();
  
  // Auth headers
  const authConfig = () => ({
    headers: { 
      Authorization: `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    }
  });

  // Check database connection
  const checkDatabase = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/debug/db`);
      setDbStatus(response.data);
    } catch (err) {
      setError(`Database error: ${err.message}`);
      console.error('Database check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status
  const checkAuth = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setAuthStatus({ error: 'No token found in localStorage' });
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/users/profile`, authConfig());
      setAuthStatus({ success: true, user: response.data });
    } catch (err) {
      setAuthStatus({ error: err.message, response: err.response?.data });
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check wishlist
  const checkWishlist = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setWishlistStatus({ error: 'Not authenticated' });
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/wishlist`, authConfig());
      setWishlistStatus({ success: true, wishlist: response.data });
    } catch (err) {
      setWishlistStatus({ error: err.message, response: err.response?.data });
      console.error('Wishlist check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Check cart
  const checkCart = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setCartStatus({ error: 'Not authenticated' });
        return;
      }
      
      const response = await axios.get(`${API_URL}/api/cart`, authConfig());
      setCartStatus({ success: true, cart: response.data });
    } catch (err) {
      setCartStatus({ error: err.message, response: err.response?.data });
      console.error('Cart check error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a test product for wishlist/cart testing
  const createTestProduct = async () => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setError('Not authenticated');
        return;
      }
      
      const response = await axios.post(`${API_URL}/api/products`, {
        name: `Test Product ${new Date().toISOString()}`,
        description: 'A test product for debugging',
        price: 99.99,
        category: 'Electronics',
        condition: 'New',
        mainImage: 'https://via.placeholder.com/300',
        stock: 10
      }, authConfig());
      
      alert(`Test product created with ID: ${response.data._id}`);
    } catch (err) {
      setError(`Create product error: ${err.message}`);
      console.error('Create product error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add to wishlist
  const addToWishlist = async (productId) => {
    try {
      setLoading(true);
      if (!isAuthenticated) {
        setError('Not authenticated');
        return;
      }
      
      const response = await axios.post(`${API_URL}/api/wishlist`, {
        productId
      }, authConfig());
      
      alert('Product added to wishlist');
      checkWishlist();
    } catch (err) {
      setError(`Add to wishlist error: ${err.message}`);
      console.error('Add to wishlist error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Format JSON for display
  const formatJSON = (json) => {
    return JSON.stringify(json, null, 2);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Debug Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Authentication Status</h2>
        <p>Token in localStorage: {getToken() ? `${getToken().substring(0, 15)}...` : 'No token'}</p>
        <p>User in localStorage: {localStorage.getItem('user') ? 'Present' : 'Not present'}</p>
        <p>Authentication state: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
        <button 
          onClick={checkAuth} 
          disabled={loading}
          style={{ padding: '8px 16px', marginRight: '10px' }}
        >
          Check Auth
        </button>
        
        {authStatus && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <pre>{formatJSON(authStatus)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Database Status</h2>
        <button 
          onClick={checkDatabase} 
          disabled={loading}
          style={{ padding: '8px 16px', marginRight: '10px' }}
        >
          Check Database
        </button>
        
        {dbStatus && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <pre>{formatJSON(dbStatus)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Wishlist Status</h2>
        <button 
          onClick={checkWishlist} 
          disabled={loading}
          style={{ padding: '8px 16px', marginRight: '10px' }}
        >
          Check Wishlist
        </button>
        
        {wishlistStatus && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <pre>{formatJSON(wishlistStatus)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Cart Status</h2>
        <button 
          onClick={checkCart} 
          disabled={loading}
          style={{ padding: '8px 16px', marginRight: '10px' }}
        >
          Check Cart
        </button>
        
        {cartStatus && (
          <div style={{ marginTop: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
            <pre>{formatJSON(cartStatus)}</pre>
          </div>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Test Actions</h2>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={createTestProduct} 
            disabled={loading}
            style={{ padding: '8px 16px', marginRight: '10px' }}
          >
            Create Test Product
          </button>
        </div>
        
        <div style={{ marginTop: '10px' }}>
          <input 
            type="text" 
            id="productId"
            placeholder="Product ID"
            style={{ padding: '8px', marginRight: '10px', width: '300px' }}
          />
          <button 
            onClick={() => addToWishlist(document.getElementById('productId').value)} 
            disabled={loading}
            style={{ padding: '8px 16px' }}
          >
            Add to Wishlist
          </button>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          border: '1px solid #f44336',
          borderRadius: '4px',
          color: '#f44336'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading && (
        <div style={{ 
          marginTop: '20px',
          padding: '10px',
          border: '1px solid #2196f3',
          borderRadius: '4px',
          color: '#2196f3'
        }}>
          Loading...
        </div>
      )}
    </div>
  );
};

export default Debug; 