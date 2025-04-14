import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart, isInWishlist, addToWishlist, removeFromWishlist } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Get the product by ID
    const productId = parseInt(id, 10);
    const foundProduct = getProductById(productId);
    
    if (foundProduct) {
      setProduct(foundProduct);
      setLoading(false);
    } else {
      // If product not found, redirect to products page after a delay
      setLoading(false);
      setTimeout(() => {
        navigate('/products');
      }, 3000);
    }
  }, [id, getProductById, navigate]);

  // Format the price with commas for thousands
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleContactSeller = () => {
    if (!product) return;
    
    // In a real app, this might open a chat interface or modal
    // For simplicity, we'll just alert with contact info
    alert(`Contact ${product.seller}:\nPhone: ${product.contact}`);
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    alert(`${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      alert(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      alert(`${product.name} added to wishlist!`);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    setQuantity(newQuantity);
  };

  if (loading) {
    return (
      <div className="product-details-page loading">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist or has been removed.</p>
        <p>Redirecting to products page...</p>
        <Link to="/products" className="button">View All Products</Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <div className="breadcrumbs">
        <Link to="/">Home</Link> &gt; 
        <Link to="/products">Products</Link> &gt; 
        <span>{product.name}</span>
      </div>

      <div className="product-details-container">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-image" />
          {product.isNew && <div className="product-badge">New</div>}
        </div>

        <div className="product-info">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating">{'⭐'.repeat(product.rating)}</div>
          <div className="product-price">{formatPrice(product.price)}</div>
          <div className="product-condition">
            <span className="label">Condition:</span> 
            <span className={`condition-badge ${product.condition.toLowerCase().replace(' ', '-')}`}>
              {product.condition}
            </span>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="label">Category:</span> 
              <span className="value">{product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
            </div>
            <div className="meta-item">
              <span className="label">Listed on:</span> 
              <span className="value">{formatDate(product.date)}</span>
            </div>
          </div>

          <div className="product-quantity">
            <span className="label">Quantity:</span>
            <div className="quantity-controls">
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity - 1)}
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                className="quantity-input"
              />
              <button 
                className="quantity-btn"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button 
              className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
              onClick={handleWishlist}
            >
              {isInWishlist(product.id) ? '❤️ Saved' : '♡ Save to Wishlist'}
            </button>
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
            <button 
              className="buy-now-btn"
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>

          <div className="seller-info">
            <h3>Seller Information</h3>
            <p><span className="label">Seller:</span> {product.seller}</p>
            <button className="contact-button" onClick={handleContactSeller}>
              Contact Seller
            </button>
          </div>

          <div className="action-buttons">
            <Link to="/products" className="back-button">
              Back to Products
            </Link>
          </div>
        </div>
      </div>

      <div className="related-products">
        <h2>You Might Also Like</h2>
        <p>Check out similar products from SPSU students</p>
        {/* In a real app, we would show related products here */}
      </div>
    </div>
  );
};

export default ProductDetails; 