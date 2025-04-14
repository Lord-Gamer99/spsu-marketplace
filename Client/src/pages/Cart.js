import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    updateCartItemQuantity(productId, parseInt(newQuantity));
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/products');
  };

  // Format price with commas for thousands
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="cart-page">
      <div className="cart-container">
        <h1>Your Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <img src="https://res.cloudinary.com/durayngkx/image/upload/v1699724929/cxa23w45gaqonobakhsy.jpg" alt="Empty cart" className="empty-cart-img" />
            <p>Your cart is empty</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="cart-header">
              <div className="cart-item-header product-col">Product</div>
              <div className="cart-item-header price-col">Price</div>
              <div className="cart-item-header quantity-col">Quantity</div>
              <div className="cart-item-header total-col">Total</div>
              <div className="cart-item-header action-col">Actions</div>
            </div>
            
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="product-col">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="cart-item-image"
                      onClick={() => navigate(`/product/${item.id}`)}
                    />
                    <div className="cart-item-details">
                      <h3 onClick={() => navigate(`/product/${item.id}`)}>{item.name}</h3>
                      <p className="cart-item-category">{item.category}</p>
                    </div>
                  </div>
                  
                  <div className="price-col">
                    {formatPrice(item.price)}
                  </div>
                  
                  <div className="quantity-col">
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        min="1" 
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                        className="quantity-input"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <div className="total-col">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <div className="action-col">
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.id)}
                      title="Remove from cart"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="cart-summary">
              <div className="cart-subtotal">
                <span>Subtotal:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="cart-shipping">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="cart-total">
                <span>Total:</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              
              <div className="cart-actions">
                <button 
                  className="continue-shopping-btn"
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
                <button 
                  className="checkout-btn"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart; 