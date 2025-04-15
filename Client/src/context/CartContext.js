import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const CartContext = createContext();

// API URL - update this to your deployed backend URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper to get token from localStorage
const getToken = () => localStorage.getItem('token');

// Helper to create auth header
const authConfig = () => {
  const token = getToken();
  console.log('Using token for API call:', token ? `${token.substring(0, 10)}...` : 'No token');
  return {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Provider Component
export const CartProvider = ({ children }) => {
  // State for cart items
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const isAuthenticated = !!user && !!getToken();

  // Debug log authentication status
  useEffect(() => {
    console.log('Authentication status:', isAuthenticated ? 'Authenticated' : 'Not authenticated');
    if (isAuthenticated) {
      console.log('User:', user);
      console.log('Token:', getToken() ? `${getToken().substring(0, 10)}...` : 'No token');
    }
  }, [isAuthenticated, user]);

  // Load cart from API when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    } else {
      // If not authenticated, load from localStorage
      try {
        const savedCart = localStorage.getItem('spsuMarketplaceCart');
        if (savedCart) setCartItems(JSON.parse(savedCart));
        
        const savedWishlist = localStorage.getItem('spsuMarketplaceWishlist');
        if (savedWishlist) setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading from localStorage:', error);
      }
    }
  }, [isAuthenticated]);

  // Save cart to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('spsuMarketplaceCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  // Save wishlist to localStorage when it changes (for non-authenticated users)
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('spsuMarketplaceWishlist', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, isAuthenticated]);

  // Fetch cart from API
  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      console.log('Fetching cart...');
      const response = await axios.get(`${API_URL}/cart`, authConfig());
      console.log('Cart response:', response.data);
      setCartItems(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setError('Failed to fetch cart items');
      setLoading(false);
    }
  };

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      console.log('Fetching wishlist...');
      const response = await axios.get(`${API_URL}/wishlist`, authConfig());
      console.log('Wishlist response:', response.data);
      setWishlistItems(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setError('Failed to fetch wishlist items');
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Adding to cart:', { productId: product._id || product.id, quantity });
        await axios.post(`${API_URL}/cart`, {
          productId: product._id || product.id,
          quantity
        }, authConfig());
        await fetchCart(); // Refetch the cart
        setLoading(false);
      } catch (error) {
        console.error('Error adding to cart:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to add item to cart');
        setLoading(false);
      }
    } else {
      // For non-authenticated users, use localStorage
      setCartItems(prevItems => {
        const existingItemIndex = prevItems.findIndex(item => item.id === (product._id || product.id));
        
        if (existingItemIndex !== -1) {
          const updatedItems = [...prevItems];
          updatedItems[existingItemIndex].quantity += quantity;
          return updatedItems;
        } else {
          return [...prevItems, { ...product, id: product._id || product.id, quantity }];
        }
      });
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Removing from cart:', productId);
        await axios.delete(`${API_URL}/cart/${productId}`, authConfig());
        await fetchCart(); // Refetch the cart
        setLoading(false);
      } catch (error) {
        console.error('Error removing from cart:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to remove item from cart');
        setLoading(false);
      }
    } else {
      setCartItems(prevItems => prevItems.filter(item => (item.id !== productId && item._id !== productId)));
    }
  };

  // Update item quantity in cart
  const updateCartItemQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Updating cart item quantity:', { productId, quantity });
        await axios.put(`${API_URL}/cart/${productId}`, { quantity }, authConfig());
        await fetchCart(); // Refetch the cart
        setLoading(false);
      } catch (error) {
        console.error('Error updating cart item:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to update cart item');
        setLoading(false);
      }
    } else {
      setCartItems(prevItems => 
        prevItems.map(item => 
          (item.id === productId || item._id === productId) ? { ...item, quantity } : item
        )
      );
    }
  };

  // Add item to wishlist
  const addToWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const productId = product._id || product.id;
        console.log('Adding to wishlist:', { productId });
        
        // Log all headers being sent
        const config = authConfig();
        console.log('Request config:', config);
        
        const response = await axios.post(`${API_URL}/wishlist`, {
          productId
        }, config);
        
        console.log('Wishlist add response:', response.data);
        await fetchWishlist(); // Refetch the wishlist
        setLoading(false);
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to add item to wishlist');
        setLoading(false);
      }
    } else {
      // For non-authenticated users, use localStorage
      if (!isInWishlist(product._id || product.id)) {
        setWishlistItems(prevItems => [...prevItems, { ...product, id: product._id || product.id }]);
      }
    }
  };

  // Remove item from wishlist
  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Removing from wishlist:', productId);
        await axios.delete(`${API_URL}/wishlist/${productId}`, authConfig());
        await fetchWishlist(); // Refetch the wishlist
        setLoading(false);
      } catch (error) {
        console.error('Error removing from wishlist:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to remove item from wishlist');
        setLoading(false);
      }
    } else {
      setWishlistItems(prevItems => prevItems.filter(item => (item.id !== productId && item._id !== productId)));
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => (item.id === productId || item.product === productId || 
                                     (item.product && item.product._id === productId) || 
                                     item._id === productId));
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || (item.product && item.product.price) || 0;
      const quantity = item.quantity || 1;
      return total + (price * quantity);
    }, 0);
  };

  // Clear cart (after checkout)
  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Clearing cart');
        await axios.delete(`${API_URL}/cart`, authConfig());
        setCartItems([]);
        setLoading(false);
      } catch (error) {
        console.error('Error clearing cart:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to clear cart');
        setLoading(false);
      }
    } else {
      setCartItems([]);
    }
  };

  // Process checkout
  const checkout = async (shippingInfo) => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        console.log('Processing checkout:', shippingInfo);
        const response = await axios.post(`${API_URL}/orders`, {
          shippingAddress: shippingInfo,
          paymentMethod: shippingInfo.paymentMethod || 'Cash on Delivery'
        }, authConfig());
        
        clearCart();
        setLoading(false);
        return response.data;
      } catch (error) {
        console.error('Error processing checkout:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        setError('Failed to process checkout');
        setLoading(false);
        throw error;
      }
    } else {
      // For non-authenticated users, provide a message
      alert('Please log in to complete your purchase');
      return null;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      wishlistItems,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateCartItemQuantity,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      getCartTotal,
      clearCart,
      checkout,
      fetchCart,
      fetchWishlist
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use the cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 