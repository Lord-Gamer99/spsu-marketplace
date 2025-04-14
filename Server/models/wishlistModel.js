const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number
  },
  category: {
    type: String,
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [wishlistItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Update total items count before saving
wishlistSchema.pre('save', function(next) {
  this.totalItems = this.items.length;
  this.updatedAt = Date.now();
  next();
});

// Method to add item to wishlist
wishlistSchema.methods.addItem = function(item) {
  // Check if item already exists in wishlist
  const exists = this.items.some(i => 
    i.product.toString() === item.product.toString()
  );
  
  if (!exists) {
    this.items.push({
      ...item,
      addedAt: Date.now()
    });
    return this.save();
  }
  
  return Promise.resolve(this); // Item already in wishlist, no change needed
};

// Method to remove item from wishlist
wishlistSchema.methods.removeItem = function(productId) {
  this.items = this.items.filter(item => 
    item.product.toString() !== productId.toString()
  );
  
  return this.save();
};

// Method to check if product is in wishlist
wishlistSchema.methods.hasItem = function(productId) {
  return this.items.some(item => 
    item.product.toString() === productId.toString()
  );
};

// Method to move item to cart
wishlistSchema.methods.moveToCart = async function(productId, CartModel, userId) {
  const item = this.items.find(item => 
    item.product.toString() === productId.toString()
  );
  
  if (!item) {
    return Promise.reject(new Error('Item not found in wishlist'));
  }
  
  try {
    // Find or create user's cart
    let cart = await CartModel.findOne({ user: userId });
    
    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: []
      });
    }
    
    // Add item to cart
    await cart.addItem({
      product: item.product,
      name: item.name,
      image: item.image,
      price: item.price,
      discountPrice: item.discountPrice,
      quantity: 1,
      seller: item.seller
    });
    
    // Remove from wishlist
    await this.removeItem(productId);
    
    return Promise.resolve({ wishlist: this, cart });
  } catch (error) {
    return Promise.reject(error);
  }
};

// Method to clear wishlist
wishlistSchema.methods.clearWishlist = function() {
  this.items = [];
  return this.save();
};

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist; 