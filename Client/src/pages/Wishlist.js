import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { wishlistItems, addToCart } = useCart();
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    navigate('/products');
  };

  const handleAddAllToCart = () => {
    wishlistItems.forEach(item => {
      addToCart(item, 1);
    });
    navigate('/cart');
  };

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h1>Your Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <img src="https://res.cloudinary.com/durayngkx/image/upload/v1699724924/poosbyjfxe8ch3ouqout.jpg" alt="Empty wishlist" className="empty-wishlist-img" />
            <p>Your wishlist is empty</p>
            <button className="continue-shopping-btn" onClick={handleContinueShopping}>
              Discover Products
            </button>
          </div>
        ) : (
          <>
            <div className="wishlist-actions">
              <button className="add-all-btn" onClick={handleAddAllToCart}>
                Add All to Cart
              </button>
            </div>
            
            <div className="wishlist-items">
              {wishlistItems.map(item => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist; 