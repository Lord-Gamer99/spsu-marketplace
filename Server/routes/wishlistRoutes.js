const express = require('express');
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

// All wishlist routes are protected
router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.route('/check/:productId').get(checkWishlist);

router.route('/:productId').delete(removeFromWishlist);

module.exports = router; 