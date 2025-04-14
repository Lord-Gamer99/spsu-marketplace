const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const mongoose = require('mongoose');

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price mainImage stock',
    });

    if (!cart) {
      // Create a new cart if it doesn't exist
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
      await cart.save();
    }

    res.json(cart);
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
 * @desc    Add item to cart
 * @route   POST /api/cart
 * @access  Private
 */
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if product is available and in stock
    if (!product.isAvailable || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available or insufficient stock',
      });
    }

    // Find user's cart
    let cart = await Cart.findOne({ user: req.user._id });

    // Create new cart if it doesn't exist
    if (!cart) {
      cart = new Cart({
        user: req.user._id,
        items: [],
      });
    }

    // Check if item already exists in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Add new item with all required fields
      cart.items.push({
        product: productId,
        name: product.name,
        image: product.mainImage || product.image,
        price: product.price,
        discountPrice: product.discountPrice,
        quantity: Number(quantity),
        seller: product.seller,
        sellerName: product.sellerName || 'Seller'
      });
    }

    // Save cart
    await cart.save();
    console.log('Cart saved with items:', cart.items.length);

    // Populate product details and return
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price mainImage stock',
    });

    res.status(201).json(populatedCart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PUT /api/cart/:productId
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0',
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product && item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (product && product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for requested quantity',
      });
    }

    // Update quantity
    cart.items[itemIndex].quantity = Number(quantity);

    // Save cart
    await cart.save();

    // Populate product details and return
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price mainImage stock',
    });

    res.json(populatedCart);
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
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/:productId
 * @access  Private
 */
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Remove item from cart
    cart.items = cart.items.filter(
      (item) => !item.product || item.product.toString() !== productId
    );

    // Save cart
    await cart.save();

    // Populate product details and return
    const populatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price mainImage stock',
    });

    res.json(populatedCart);
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
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    // Clear cart items
    cart.items = [];

    // Save cart
    await cart.save();

    res.json({ message: 'Cart cleared' });
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
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
}; 