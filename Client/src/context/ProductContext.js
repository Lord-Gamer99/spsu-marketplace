import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const ProductContext = createContext();

// Initial demo products
const initialProducts = [
  {
    id: 1,
    name: "Hp 15s Laptop",
    description: "High-performance laptop for students and professionals with Intel Core i5 processor and 8GB RAM",
    price: 35000,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724929/cxa23w45gaqonobakhsy.jpg",
    seller: "Rahul Sharma",
    contact: "+91 98765 43210",
    condition: "Like New",
    rating: 5,
    isNew: true,
    category: "electronics",
    date: new Date().toISOString()
  },
  {
    id: 2,
    name: "Mi Business Casual Backpack",
    description: "Stylish and functional backpack for everyday use with water-resistant material",
    price: 500,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724924/poosbyjfxe8ch3ouqout.jpg",
    seller: "Priya Patel",
    contact: "+91 87654 32109",
    condition: "Excellent",
    rating: 5,
    category: "accessories",
    date: new Date().toISOString()
  },
  {
    id: 3,
    name: "35 Watt Fast Charger (Type C)",
    description: "Rapid charging solution for your devices with USB Type-C connector",
    price: 400,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724933/qzcdyvyargnd8lebuq5n.jpg",
    seller: "Arjun Kumar",
    contact: "+91 76543 21098",
    condition: "New",
    rating: 5,
    category: "electronics",
    date: new Date().toISOString()
  },
  {
    id: 4,
    name: "DIZO Watch 2",
    description: "Feature-rich smartwatch with fitness tracking and heart rate monitor",
    price: 1500,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724935/gybxoshrxz5prpxqsl5v.jpg",
    seller: "Aanya Singh",
    contact: "+91 65432 10987",
    condition: "Like New",
    rating: 5,
    isNew: true,
    category: "accessories",
    date: new Date().toISOString()
  },
  {
    id: 5,
    name: "Rubik's Cube 3X3",
    description: "Classic puzzle for entertainment and mind development with smooth rotation",
    price: 200,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724922/v1zfdpkc9lzmy69drzpu.jpg",
    seller: "Sanjay Gupta",
    contact: "+91 54321 09876",
    condition: "Good",
    rating: 5,
    category: "toys",
    date: new Date().toISOString()
  },
  {
    id: 6,
    name: "Portronics SoundDrum",
    description: "High-quality portable bluetooth speaker with rich bass and crystal clear sound",
    price: 1000,
    image: "https://res.cloudinary.com/durayngkx/image/upload/v1699724353/gx620hlpksricakxthmx.jpg",
    seller: "Varun Mehta",
    contact: "+91 43210 98765",
    condition: "Excellent",
    rating: 5,
    category: "electronics",
    date: new Date().toISOString()
  }
];

// Provider Component
export const ProductProvider = ({ children }) => {
  // Check if there are products in localStorage, otherwise use initial demo products
  const [products, setProducts] = useState(() => {
    try {
      const savedProducts = localStorage.getItem('spsuMarketplaceProducts');
      if (savedProducts) {
        return JSON.parse(savedProducts);
      }
      return initialProducts;
    } catch (error) {
      console.error("Error loading products from localStorage:", error);
      return initialProducts;
    }
  });

  // Save products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('spsuMarketplaceProducts', JSON.stringify(products));
    } catch (error) {
      console.error("Error saving products to localStorage:", error);
    }
  }, [products]);

  // Add a new product
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(), // Simple way to generate a unique ID
      date: new Date().toISOString(),
      rating: product.rating || 5, // Default rating for new products
    };
    
    setProducts([newProduct, ...products]);
    return newProduct.id; // Return the ID of the new product
  };

  // Remove a product
  const removeProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
  };

  // Get a single product by ID
  const getProductById = (productId) => {
    return products.find(product => product.id === parseInt(productId));
  };

  // Filter products by category
  const getProductsByCategory = (category) => {
    return category === 'all' 
      ? products 
      : products.filter(product => product.category === category);
  };

  // Get featured products (newest or selected products)
  const getFeaturedProducts = (limit = 6) => {
    return [...products]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      removeProduct,
      getProductById,
      getProductsByCategory,
      getFeaturedProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Custom hook to use the product context
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 