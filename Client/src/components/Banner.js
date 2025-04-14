import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Banner.css';

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/products?category=${selectedCategory}&search=${encodeURIComponent(searchQuery)}`);
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'accessories', name: 'Accessories' },
    { id: 'books', name: 'Books' },
    { id: 'toys', name: 'Toys' }
  ];

  return (
    <section className="banner">
      <div className="banner-text-item">
        <div className="banner-heading">
          <h1>Find your Next product!</h1>
        </div>
        <form className="form" onSubmit={handleSearch}>
          <div className="search-input-container">
            <select 
              className="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              aria-label="Select category"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder="Search for laptops, books, accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
          </div>
          <button 
            type="submit" 
            className="buy"
            title={searchQuery ? "Search for products" : "Browse all products in category"}
          >
            {searchQuery ? "Search" : "Browse"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Banner; 