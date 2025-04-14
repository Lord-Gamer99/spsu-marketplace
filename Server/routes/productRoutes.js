const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsBySeller,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.route('/').get(getProducts);
router.route('/featured').get(getFeaturedProducts);
router.route('/seller/:id').get(getProductsBySeller);
router.route('/:id').get(getProductById);

// Protected routes
router.route('/').post(protect, createProduct);
router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router; 