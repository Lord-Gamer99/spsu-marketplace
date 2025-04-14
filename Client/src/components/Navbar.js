import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaShoppingCart, FaHeart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, wishlistItems } = useCart();

  // Check for authentication on mount and when location changes
  useEffect(() => {
    const checkAuth = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    };
    
    checkAuth();
  }, [location.pathname]);

  // Handle scroll effect for Navbar
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSellClick = () => {
    navigate('/sell');
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <section className={`nav-bar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <Link to="/home">SPSU Marketplace</Link>
        <button className="sell-button" id="sellOption" onClick={handleSellClick}>
          Sell
        </button>
      </div>
      
      <div className="hamburger" onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
      
      <ul className={`menu ${isMenuOpen ? 'active' : ''}`}>
        <li><Link to="/home" onClick={() => setIsMenuOpen(false)}>Home</Link></li>
        <li><Link to="/products" onClick={() => setIsMenuOpen(false)}>Products</Link></li>
        <li><Link to="/about-us" onClick={() => setIsMenuOpen(false)}>About Us</Link></li>
        <li><Link to="/contact" onClick={() => setIsMenuOpen(false)}>Contact Us</Link></li>
        <li className="nav-icon">
          <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
            <FaHeart />
            {wishlistItems.length > 0 && <span className="badge">{wishlistItems.length}</span>}
          </Link>
        </li>
        <li className="nav-icon">
          <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
            <FaShoppingCart />
            {cartItems.length > 0 && <span className="badge">{cartItems.length}</span>}
          </Link>
        </li>
        <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>Profile</Link></li>
        <li><button className="logout-button" onClick={handleLogout}><FaSignOutAlt /> Logout</button></li>
      </ul>
    </section>
  );
};

export default Navbar; 