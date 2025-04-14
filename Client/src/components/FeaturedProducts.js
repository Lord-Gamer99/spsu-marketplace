import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import './FeaturedProducts.css';
import { useProducts } from '../context/ProductContext';

const FeaturedProducts = () => {
  const { getFeaturedProducts } = useProducts();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('all');

  // Get products from context
  const products = getFeaturedProducts(6);
  
  // Filter products by category
  const filteredProducts = category === 'all' 
    ? products 
    : products.filter(product => product.category === category);

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Discover high-quality items from fellow SPSU students</p>
        </div>

        <div className="category-filter">
          <button 
            className={`filter-btn ${category === 'all' ? 'active' : ''}`} 
            onClick={() => setCategory('all')}
          >
            All
          </button>
          <button 
            className={`filter-btn ${category === 'electronics' ? 'active' : ''}`} 
            onClick={() => setCategory('electronics')}
          >
            Electronics
          </button>
          <button 
            className={`filter-btn ${category === 'accessories' ? 'active' : ''}`} 
            onClick={() => setCategory('accessories')}
          >
            Accessories
          </button>
          <button 
            className={`filter-btn ${category === 'toys' ? 'active' : ''}`} 
            onClick={() => setCategory('toys')}
          >
            Toys
          </button>
        </div>

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading products...</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <p>No products found in this category.</p>
                </div>
              )}
            </div>
            
            <div className="view-more-container">
              <Link to="/products" className="view-more-btn">
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;