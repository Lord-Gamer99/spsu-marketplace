import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import './AllProducts.css';

const AllProducts = () => {
  const { products } = useProducts();
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const location = useLocation();

  // Parse query parameters on component mount and when URL changes
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    const searchParam = queryParams.get('search');
    
    if (categoryParam) {
      setCategory(categoryParam);
    }
    
    if (searchParam) {
      setSearchTerm(searchParam);
    }
  }, [location.search]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter products based on multiple criteria
  const filteredProducts = products
    .filter(product => 
      (category === 'all' || product.category === category) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       product.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (product.price >= priceRange.min && product.price <= priceRange.max)
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'priceLow':
          return a.price - b.price;
        case 'priceHigh':
          return b.price - a.price;
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        case 'latest':
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

  // Get unique categories for filter
  const categories = ['all', ...new Set(products.map(product => product.category))];

  // Handle price range change
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(value)
    }));
  };

  return (
    <div className="all-products-page">
      <div className="products-hero">
        <h1>All Products</h1>
        <p>Browse all available items from SPSU students</p>
      </div>

      <div className="products-container">
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3>Search</h3>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="category-buttons">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`category-btn ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min="0"
              />
            </div>
          </div>

          <div className="filter-section">
            <h3>Sort By</h3>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="latest">Newest First</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAZ">Name: A to Z</option>
              <option value="nameZA">Name: Z to A</option>
            </select>
          </div>
        </div>

        <div className="products-grid-container">
          <div className="products-header">
            <h2>
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'} 
              {category !== 'all' ? ` in ${category}` : ''}
              {searchTerm ? ` matching "${searchTerm}"` : ''}
            </h2>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="products-grid">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} showDelete={true} />
              ))}
            </div>
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
              <button onClick={() => {
                setSearchTerm('');
                setCategory('all');
                setPriceRange({ min: 0, max: 100000 });
              }} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts; 