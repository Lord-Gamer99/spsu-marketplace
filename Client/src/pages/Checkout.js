import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaArrowLeft, FaCheck } from 'react-icons/fa';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order processing
    setTimeout(() => {
      setOrderPlaced(true);
      clearCart();
    }, 1500);
  };

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="empty-checkout">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" 
              alt="Empty Cart" 
              className="empty-checkout-img"
            />
            <h2>Your cart is empty</h2>
            <p>Add items to your cart to checkout</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="order-success">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Your order has been placed and will be delivered soon.</p>
            <p className="order-id">Order ID: SPSU{Math.floor(Math.random() * 10000000)}</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <button className="back-button" onClick={() => navigate('/cart')}>
          <FaArrowLeft /> Back to Cart
        </button>
        
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-container">
            <h2>Shipping Information</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input 
                  type="text" 
                  id="fullName" 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <textarea 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">PIN Code</label>
                  <input 
                    type="text" 
                    id="pincode" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group payment-methods">
                <h3>Payment Method</h3>
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="cod" 
                    name="paymentMethod" 
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="cod">Cash on Delivery</label>
                </div>
                
                <div className="payment-option">
                  <input 
                    type="radio" 
                    id="online" 
                    name="paymentMethod"
                    value="online"
                    checked={formData.paymentMethod === 'online'}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="online">Pay Online (UPI/Card)</label>
                </div>
              </div>
              
              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            
            <div className="order-items">
              {cartItems.map(item => (
                <div className="summary-item" key={item.id}>
                  <div className="summary-item-img">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100x100?text=Product";
                      }}
                    />
                  </div>
                  <div className="summary-item-details">
                    <h4>{item.name}</h4>
                    <p>{formatPrice(item.price)} x {item.quantity}</p>
                  </div>
                  <div className="summary-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="total-row">
                <span>Shipping</span>
                <span>{cartTotal > 1000 ? 'Free' : formatPrice(100)}</span>
              </div>
              <div className="total-row grand-total">
                <span>Total</span>
                <span>{formatPrice(cartTotal > 1000 ? cartTotal : cartTotal + 100)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 