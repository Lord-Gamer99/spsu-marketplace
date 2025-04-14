import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product, showDelete = false }) => {
  const navigate = useNavigate();
  const { removeProduct } = useProducts();
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    alert(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      alert(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      alert(`${product.name} added to wishlist!`);
    }
  };

  const handleDeleteProduct = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      removeProduct(product.id);
      alert(`${product.name} has been deleted.`);
    }
  };

  // Format the price with commas for thousands
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0
  }).format(product.price);

  // Ensure the image URL is valid
  const imageUrl = product.image && typeof product.image === 'string' 
    ? product.image 
    : 'https://via.placeholder.com/300?text=No+Image';

  const wishlistActive = isInWishlist(product.id);
  
  return (
    <div className="card">
      {product.isNew && <div className="card-badge">New</div>}
      {showDelete && (
        <button 
          className="delete-product-btn"
          onClick={handleDeleteProduct}
          title="Delete Product"
        >
          ×
        </button>
      )}
      <div className="zoom-img" onClick={handleViewDetails}>
        <img src={imageUrl} alt={product.name} onError={(e) => {
          e.target.onerror = null; 
          e.target.src = 'https://via.placeholder.com/300?text=Image+Error';
        }} />
      </div>

      <div className="text">
        <span className="rating">{'⭐'.repeat(product.rating || 0)}</span>
        <h2 onClick={handleViewDetails}>{product.name}</h2>
        <p>{product.description && product.description.substring(0, 60)}...</p>
        <div className="cost">{formattedPrice}</div>
        <div className="card-box">
          <button 
            className="card-button"
            onClick={handleAddToCart}
            title="Add to Cart"
          >
            Add to Cart
          </button>
          <button 
            className={`card-button outline wishlist-btn ${wishlistActive ? 'active' : ''}`}
            onClick={handleWishlist}
            title={wishlistActive ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {wishlistActive ? '❤️' : '♡'} {wishlistActive ? 'Saved' : 'Save'}
          </button>
        </div>
        <button 
          className="buy-now-btn"
          onClick={(e) => {
            handleAddToCart(e);
            navigate('/checkout');
          }}
          title="Buy Now"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductCard; 