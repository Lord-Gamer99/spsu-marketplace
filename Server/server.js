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

// Debug logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', JSON.stringify(req.body, null, 2));
  }
  
  // Track response
  const originalSend = res.send;
  res.send = function(data) {
    console.log(`[${new Date().toISOString()}] Response for ${req.method} ${req.url} - Status: ${res.statusCode}`);
    return originalSend.apply(res, arguments);
  };
  
  next();
});

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Atlas Connection with improved error handling and retry logic
const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const mongoURI = process.env.MONGODB_URI;
    console.log('Connecting to MongoDB Atlas...');
    
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      },
      serverSelectionTimeoutMS: 5000,
      family: 4,
      autoIndex: true,
      autoCreate: true,
      maxPoolSize: 10, // Maximum number of connections in the connection pool
      minPoolSize: 5,  // Minimum number of connections in the connection pool
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      connectTimeoutMS: 10000 // Give up initial connection after 10 seconds
    };
    
    // Close any existing connections
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    
    await mongoose.connect(mongoURI, options);
    console.log('✅ MongoDB Atlas Connected Successfully!');
    
    // Log available collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections in MongoDB:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Set up connection event handlers
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
      console.error('Error details:', {
        name: err.name,
        message: err.message,
        code: err.code,
        codeName: err.codeName
      });
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected. Attempting to reconnect...');
      setTimeout(connectDB, 5000);
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully!');
    });
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      codeName: error.codeName
    });
    
    if (error.message.includes('bad auth')) {
      console.error('Authentication failed. Please check:');
      console.error('1. Your MongoDB Atlas username and password are correct');
      console.error('2. Your database user has proper permissions');
      console.error('3. The password contains no special characters that need URL encoding');
      console.error('4. The database name in the connection string is correct');
    } else if (error.name === 'MongoServerSelectionError') {
      console.error('Cannot connect to MongoDB Atlas. Please check:');
      console.error('1. Your connection string is correct');
      console.error('2. Your IP is whitelisted in MongoDB Atlas');
      console.error('3. Your database user has proper permissions');
    }
    
    // Retry connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Connect to MongoDB Atlas
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

// Add a debug route to check MongoDB connection
app.get('/api/debug/db', async (req, res) => {
  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      // Get collection names
      const collections = await mongoose.connection.db.listCollections().toArray();
      
      // Count documents in each collection
      const collectionStats = {};
      for (const collection of collections) {
        const count = await mongoose.connection.db.collection(collection.name).countDocuments();
        collectionStats[collection.name] = count;
      }
      
      res.json({
        success: true,
        message: 'MongoDB connected',
        connectionState: 'Connected',
        database: mongoose.connection.db.databaseName,
        collections: collectionStats
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'MongoDB not connected',
        connectionState: mongoose.STATES[mongoose.connection.readyState]
      });
    }
  } catch (error) {
    console.error('Debug route error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking MongoDB connection',
      error: error.message
    });
  }
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