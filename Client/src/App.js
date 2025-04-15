import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Import pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import TermsConditions from './pages/TermsConditions';
import Privacy from './pages/Privacy';
import ContactUs from './pages/ContactUs';
import ProductDetails from './pages/ProductDetails';
import AllProducts from './pages/AllProducts';
import SellProduct from './pages/SellProduct';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import Debug from './pages/Debug';

// Import context
import { ProductProvider } from './context/ProductContext';
import { CartProvider } from './context/CartContext';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Root Route to redirect unauthenticated users
const RootRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />;
};

// Layout component that conditionally renders Navbar and Footer
const Layout = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userInfo && token) {
      setUser(JSON.parse(userInfo));
    } else {
      setUser(null);
    }
  }, [location.pathname]);
  
  // Don't render navbar and footer on login/register pages
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <>
      {!isAuthPage && user && <Navbar />}
      {children}
      {!isAuthPage && user && <Footer />}
    </>
  );
};

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Layout>
              <Routes>
                {/* Root path redirects based on auth status */}
                <Route path="/" element={<RootRoute />} />
                
                {/* Auth routes - accessible without authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                {/* Debug page - open access for troubleshooting */}
                <Route path="/debug" element={<Debug />} />
                
                {/* Protected routes - require authentication */}
                <Route path="/home" element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } />
                <Route path="/about-us" element={
                  <ProtectedRoute>
                    <AboutUs />
                  </ProtectedRoute>
                } />
                <Route path="/terms" element={
                  <ProtectedRoute>
                    <TermsConditions />
                  </ProtectedRoute>
                } />
                <Route path="/privacy" element={
                  <ProtectedRoute>
                    <Privacy />
                  </ProtectedRoute>
                } />
                <Route path="/contact" element={
                  <ProtectedRoute>
                    <ContactUs />
                  </ProtectedRoute>
                } />
                <Route path="/products" element={
                  <ProtectedRoute>
                    <AllProducts />
                  </ProtectedRoute>
                } />
                <Route path="/product/:id" element={
                  <ProtectedRoute>
                    <ProductDetails />
                  </ProtectedRoute>
                } />
                <Route path="/sell" element={
                  <ProtectedRoute>
                    <SellProduct />
                  </ProtectedRoute>
                } />
                <Route path="/cart" element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } />
                <Route path="/wishlist" element={
                  <ProtectedRoute>
                    <Wishlist />
                  </ProtectedRoute>
                } />
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
              </Routes>
            </Layout>
          </div>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App; 