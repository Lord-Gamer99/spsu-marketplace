const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300?text=Product',
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['electronics', 'accessories', 'books', 'clothing', 'furniture', 'toys', 'others'],
    },
    condition: {
      type: String,
      required: [true, 'Product condition is required'],
      enum: ['New', 'Like New', 'Excellent', 'Good', 'Fair'],
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Seller information is required'],
    },
    sellerName: {
      type: String,
    },
    contact: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

// Add virtual for formatted date
productSchema.virtual('formattedDate').get(function () {
  return new Date(this.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

// Ensure virtuals are included in JSON
productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 