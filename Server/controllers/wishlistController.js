const Wishlist = require('../models/wishlistModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const mongoose = require('mongoose');

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price mainImage category'
    });

    if (!wishlist) {
      // Create a new wishlist if it doesn't exist
      wishlist = new Wishlist({
        user: req.user._id,
        items: []
      });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    // Validate product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Find user's wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    // Create new wishlist if it doesn't exist
    if (!wishlist) {
      wishlist = new Wishlist({
        user: req.user._id,
        items: []
      });
    }

    // Check if product already exists in wishlist
    const existingItem = wishlist.items.find(item => 
      item.product && item.product.toString() === productId
    );

    if (!existingItem) {
      // Add new wishlist item with required fields
      wishlist.items.push({
        product: productId,
        name: product.name,
        image: product.mainImage || product.image,
        price: product.price,
        discountPrice: product.discountPrice,
        category: product.category,
        seller: product.seller
      });
      
      await wishlist.save();
      console.log('Item added to wishlist:', productId);
    } else {
      console.log('Item already exists in wishlist:', productId);
    }

    // Populate product details and return
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'name price mainImage category'
    });

    res.status(201).json(populatedWishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Remove product from wishlist items
    wishlist.items = wishlist.items.filter(
      (item) => item.product.toString() !== productId
    );

    // Save wishlist
    await wishlist.save();

    // Populate product details and return
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'items.product',
      select: 'name price mainImage category'
    });

    res.json(populatedWishlist);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Check if product is in wishlist
 * @route   GET /api/wishlist/check/:productId
 * @access  Private
 */
const checkWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    // Check if product is in wishlist
    const inWishlist = wishlist.items.some(
      (item) => item.product.toString() === productId
    );

    res.json({ inWishlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Clear wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
const clearWishlist = async (req, res) => {
  try {
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    // Clear wishlist items
    wishlist.items = [];

    // Save wishlist
    await wishlist.save();

    res.json({ message: 'Wishlist cleared' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
  clearWishlist,
}; 