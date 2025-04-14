const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true,
    default: 'India'
  },
  phone: {
    type: String,
    required: true
  }
});

const paymentResultSchema = new mongoose.Schema({
  id: String,
  status: String,
  update_time: String,
  email_address: String,
  paymentMethod: {
    type: String,
    enum: ['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
    default: 'Cash on Delivery'
  }
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash on Delivery', 'Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
    default: 'Cash on Delivery'
  },
  paymentResult: paymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  trackingNumber: String,
  notes: String,
  cancelReason: String
}, {
  timestamps: true
});

// Pre-save hook to calculate prices if not provided
orderSchema.pre('save', function(next) {
  if (this.isModified('orderItems')) {
    // Calculate itemsPrice
    this.itemsPrice = this.orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    
    // Apply shipping fee and tax logic
    this.shippingPrice = this.itemsPrice > 500 ? 0 : 50; // Free shipping over Rs. 500
    this.taxPrice = Math.round(this.itemsPrice * 0.18 * 100) / 100; // 18% GST
    
    // Calculate total
    this.totalPrice = this.itemsPrice + this.shippingPrice + this.taxPrice;
  }
  
  next();
});

// Add transaction ID for order tracking
orderSchema.methods.generateOrderId = function() {
  const timestamp = new Date().getTime();
  const randomPart = Math.floor(Math.random() * 10000);
  return `SPM-${timestamp}-${randomPart}`;
};

// Method to update order status
orderSchema.methods.updateStatus = function(status, notes) {
  this.status = status;
  
  if (notes) {
    this.notes = notes;
  }
  
  if (status === 'Delivered') {
    this.isDelivered = true;
    this.deliveredAt = Date.now();
  }
  
  return this.save();
};

// Method to mark as paid
orderSchema.methods.markAsPaid = function(paymentResult) {
  this.isPaid = true;
  this.paidAt = Date.now();
  this.paymentResult = paymentResult;
  
  return this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason) {
  this.status = 'Cancelled';
  this.cancelReason = reason;
  
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 