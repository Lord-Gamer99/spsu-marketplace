const express = require('express');
const router = express.Router();
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

// All order routes are protected
router.use(protect);

// User routes
router.route('/')
  .get(getUserOrders)
  .post(createOrder);

router.route('/:id').get(getOrderById);
router.route('/:id/pay').put(updateOrderToPaid);

// Admin routes
router.route('/admin').get(admin, getAllOrders);
router.route('/:id/status').put(admin, updateOrderStatus);

module.exports = router; 