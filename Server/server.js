const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Load environment variables
dotenv.config();

// Initialize express
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection with improved error handling and retry logic
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SPSU_Marketplace';
    console.log('Connecting to MongoDB at:', mongoURI);
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      family: 4, // Use IPv4, skip trying IPv6
      // Enable strict validation for all models
      autoIndex: true, // Build indexes
      autoCreate: true // Auto create collections
    };
    
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Log available collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections in MongoDB:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    
    // Print more detailed error information
    if (error.name === 'MongoServerSelectionError') {
      console.error('Cannot connect to MongoDB server. Please check if MongoDB is running.');
      console.error('Try starting MongoDB using: mongod --dbpath=C:\\data\\db');
    }
    
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB
connectDB();

// In-memory OTP storage
const otpStore = new Map();

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Add a simple health check endpoint that requires no auth
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../Client/build')));

// All other GET requests not handled before will return the React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../Client/build', 'index.html'));
});

// Add a route for password reset
app.post('/api/users/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }
    
    // In a real application, you would verify the email exists in your database
    // For now, we'll just return success for any email
    
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with expiration time (15 minutes)
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes from now
    otpStore.set(email, {
      otp,
      expiresAt
    });
    
    // For testing purposes, we'll log it to the console
    console.log(`OTP for ${email}: ${otp}`);
    console.log(`This OTP will expire at: ${new Date(expiresAt).toLocaleTimeString()}`);
    
    // In a real application, you would send this OTP via email
    
    return res.status(200).json({ 
      success: true, 
      message: 'Password reset code sent successfully' 
    });
  } catch (error) {
    console.error('Error in forgot-password route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error processing password reset request'
    });
  }
});

app.post('/api/users/verify-reset-code', async (req, res) => {
  try {
    const { email, resetCode } = req.body;
    
    if (!email || !resetCode) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and reset code are required' 
      });
    }
    
    // Get the stored OTP data
    const otpData = otpStore.get(email);
    
    // Check if OTP exists
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found for this email or code has expired. Please request a new code.'
      });
    }
    
    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      // Remove expired OTP
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new code.'
      });
    }
    
    // Check if OTP matches
    if (resetCode !== otpData.otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please try again.'
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Reset code verified successfully' 
    });
  } catch (error) {
    console.error('Error in verify-reset-code route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error verifying reset code'
    });
  }
});

app.post('/api/users/reset-password', async (req, res) => {
  try {
    const { email, resetCode, newPassword } = req.body;
    
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email, reset code, and new password are required' 
      });
    }
    
    // Get the stored OTP data
    const otpData = otpStore.get(email);
    
    // Check if OTP exists
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found for this email or code has expired. Please restart the password reset process.'
      });
    }
    
    // Check if OTP has expired
    if (Date.now() > otpData.expiresAt) {
      // Remove expired OTP
      otpStore.delete(email);
      return res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please restart the password reset process.'
      });
    }
    
    // Check if OTP matches
    if (resetCode !== otpData.otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please try again.'
      });
    }
    
    // In a real application, you would:
    // 1. Hash the new password
    // 2. Update the user's password in the database
    
    // Clear the OTP after successful password reset
    otpStore.delete(email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Password reset successfully' 
    });
  } catch (error) {
    console.error('Error in reset-password route:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error resetting password'
    });
  }
});

// Home route
app.get('/', (req, res) => {
  res.send('SPSU Marketplace API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong on the server',
  });
});

// Define port
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

// Start server
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Server accessible at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/`);
  console.log(`📱 For mobile access, use your computer's IP address with port ${PORT}`);
}); 