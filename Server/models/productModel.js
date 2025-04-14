const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide a product description']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a product price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Please provide a product category'],
    enum: [
      'Electronics',
      'Books',
      'Clothing',
      'Furniture',
      'Sports',
      'Health & Beauty',
      'Accessories',
      'Other'
    ]
  },
  subcategory: {
    type: String,
    trim: true
  },
  condition: {
    type: String,
    enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
    default: 'New'
  },
  images: [{
    url: String,
    altText: String
  }],
  mainImage: {
    type: String,
    required: [true, 'Please provide a main product image']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerName: {
    type: String,
    required: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 1
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
  tags: [String],
  location: {
    type: String,
    default: 'SPSU Campus'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Add virtual for discount percentage
productSchema.virtual('discountPercentage').get(function() {
  if (!this.discountPrice || this.discountPrice >= this.price) {
    return 0;
  }
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

// Calculate average rating when a review is added
productSchema.methods.updateAverageRating = function() {
  const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = this.reviews.length > 0 ? (totalRating / this.reviews.length).toFixed(1) : 0;
  this.numReviews = this.reviews.length;
  return this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product; 