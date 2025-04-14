const Product = require('../models/productModel');
const User = require('../models/userModel');

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort } = req.query;
    let query = {};

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by name
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by price range
    if (minPrice && maxPrice) {
      query.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    } else if (minPrice) {
      query.price = { $gte: Number(minPrice) };
    } else if (maxPrice) {
      query.price = { $lte: Number(maxPrice) };
    }

    // Create query
    let productsQuery = Product.find(query).populate('seller', 'name');

    // Sorting
    if (sort) {
      switch (sort) {
        case 'latest':
          productsQuery = productsQuery.sort({ createdAt: -1 });
          break;
        case 'oldest':
          productsQuery = productsQuery.sort({ createdAt: 1 });
          break;
        case 'price-low':
          productsQuery = productsQuery.sort({ price: 1 });
          break;
        case 'price-high':
          productsQuery = productsQuery.sort({ price: -1 });
          break;
        case 'name-asc':
          productsQuery = productsQuery.sort({ name: 1 });
          break;
        case 'name-desc':
          productsQuery = productsQuery.sort({ name: -1 });
          break;
        default:
          productsQuery = productsQuery.sort({ createdAt: -1 });
      }
    } else {
      // Default sorting by latest
      productsQuery = productsQuery.sort({ createdAt: -1 });
    }

    // Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    productsQuery = productsQuery.skip(skip).limit(limit);

    // Execute query
    const products = await productsQuery;
    const totalProducts = await Product.countDocuments(query);

    res.json({
      products,
      page,
      pages: Math.ceil(totalProducts / limit),
      total: totalProducts,
    });
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
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 6;
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('seller', 'name');

    res.json(products);
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
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('seller', 'name phone');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }
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
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private
 */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      condition,
    } = req.body;

    // Create new product
    const product = new Product({
      name,
      description,
      price,
      image: image || 'https://via.placeholder.com/300?text=Product',
      category,
      condition,
      isNew: condition === 'New',
      seller: req.user._id,
      sellerName: req.user.name,
      contact: req.user.phone,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
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
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private
 */
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      condition,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    // Update product
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.image = image || product.image;
    product.category = category || product.category;
    product.condition = condition || product.condition;
    product.isNew = condition === 'New' || product.isNew;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
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
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private
 */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Check if user is the seller or admin
    if (product.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
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
 * @desc    Get products by seller
 * @route   GET /api/products/seller/:id
 * @access  Public
 */
const getProductsBySeller = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.params.id })
      .sort({ createdAt: -1 })
      .populate('seller', 'name');

    res.json(products);
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
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductsBySeller,
}; 