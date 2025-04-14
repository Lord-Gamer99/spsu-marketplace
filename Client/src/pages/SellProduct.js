import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import './SellProduct.css';

const SellProduct = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('electronics');
  const [productCondition, setProductCondition] = useState('New');
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);
  
  const { addProduct } = useProducts();
  const navigate = useNavigate();

  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductImage(reader.result);
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!productName || !productDescription || !productPrice) {
      alert('Please fill all the required fields.');
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Create a new product object
      const newProduct = {
        name: productName,
        description: productDescription,
        price: parseFloat(productPrice),
        image: productImage || 'https://via.placeholder.com/300?text=No+Image',
        seller: 'Current User', // In a real app, this would come from user authentication
        contact: 'user@example.com', // In a real app, this would come from user authentication
        condition: productCondition,
        category: productCategory,
        rating: 5, // Default rating for new products
        isNew: productCondition === 'New',
        date: new Date().toISOString()
      };

      // Add the product using the context function
      const productId = addProduct(newProduct);
      
      // Show success message
      setSuccessMessage('Product added successfully!');
      
      // Reset form
      setProductName('');
      setProductDescription('');
      setProductImage(null);
      setPreviewImage(null);
      setProductPrice('');
      setSelectedFileName('');
      setProductCategory('electronics');
      setProductCondition('New');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      alert('There was an error adding your product. Please try again.');
      console.error('Error adding product:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-product-page">
      <div className="sell-product-container">
        <div className="sell-product-header">
          <h1>Sell Your Product</h1>
          <p>List your item for sale at SPSU Marketplace</p>
        </div>
        
        {successMessage && (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>{successMessage}</p>
            <p className="redirect-message">Redirecting to products page...</p>
          </div>
        )}
        
        {!successMessage && (
          <form className="sell-product-form" onSubmit={handleSubmit}>
            <div className="form-sections">
              <div className="form-section">
                <h2>Basic Information</h2>
                
                <div className="form-group">
                  <label htmlFor="productName">Product Name*</label>
                  <input 
                    type="text" 
                    id="productName" 
                    placeholder="Enter product name (e.g. HP Laptop, Scientific Calculator)" 
                    required 
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="productCategory">Category*</label>
                  <select
                    id="productCategory"
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    required
                  >
                    <option value="electronics">Electronics</option>
                    <option value="accessories">Accessories</option>
                    <option value="books">Books</option>
                    <option value="clothing">Clothing</option>
                    <option value="furniture">Furniture</option>
                    <option value="toys">Toys</option>
                    <option value="others">Others</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="productCondition">Condition*</label>
                  <select
                    id="productCondition"
                    value={productCondition}
                    onChange={(e) => setProductCondition(e.target.value)}
                    required
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="productPrice">Price* (₹)</label>
                  <input 
                    type="number" 
                    id="productPrice" 
                    placeholder="Enter price in Rupees" 
                    required 
                    min="1"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="form-section">
                <h2>Description & Images</h2>
                
                <div className="form-group">
                  <label htmlFor="productDescription">Product Description*</label>
                  <textarea
                    id="productDescription" 
                    placeholder="Describe your product in detail. Include condition, features, and any relevant information for buyers." 
                    required 
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    rows="6"
                  ></textarea>
                </div>
                
                <div className="form-group">
                  <label htmlFor="productImage">Product Images</label>
                  <div className="image-upload-container">
                    <input 
                      type="file" 
                      id="productImage" 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="image-input"
                      ref={fileInputRef}
                    />
                    <label htmlFor="productImage" className="upload-button" onClick={handleImageButtonClick}>
                      <span>Choose Image</span>
                    </label>
                    <div className="file-name">
                      {selectedFileName || "No image selected"}
                    </div>
                  </div>
                  
                  {previewImage && (
                    <div className="image-preview">
                      <img src={previewImage} alt="Product preview" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="sell-product-actions">
              <button type="button" className="cancel-btn" onClick={() => navigate('/products')}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Adding Product...' : 'Add Product'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default SellProduct; 