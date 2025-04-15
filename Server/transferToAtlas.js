const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import and register all models
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const Order = require('./models/orderModel');
const Wishlist = require('./models/wishlistModel');

const transferData = async () => {
  try {
    // Connect to MongoDB Atlas
    const atlasURI = 'mongodb+srv://lordgameranurag:987654321Anu@cluster0.lfpl7c7.mongodb.net/SPSU_Marketplace?retryWrites=true&w=majority';
    const atlasConn = await mongoose.createConnection(atlasURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      retryReads: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('✅ Connected to MongoDB Atlas');

    // Register models for Atlas connection
    const AtlasUser = atlasConn.model('User', User.schema);
    const AtlasProduct = atlasConn.model('Product', Product.schema);
    const AtlasCart = atlasConn.model('Cart', Cart.schema);
    const AtlasOrder = atlasConn.model('Order', Order.schema);
    const AtlasWishlist = atlasConn.model('Wishlist', Wishlist.schema);

    // Initialize collections in Atlas
    console.log('Initializing collections in Atlas...');

    // Initialize Users collection
    console.log('Initializing Users collection...');
    const userCount = await AtlasUser.countDocuments();
    let adminUser;
    if (userCount === 0) {
      adminUser = await AtlasUser.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        isAdmin: true
      });
      console.log('✅ Created admin user');
    } else {
      adminUser = await AtlasUser.findOne({ isAdmin: true });
      console.log(`✅ Users collection already has ${userCount} documents`);
    }

    // Initialize Products collection
    console.log('Initializing Products collection...');
    const productCount = await AtlasProduct.countDocuments();
    if (productCount === 0 && adminUser) {
      await AtlasProduct.create({
        name: 'Sample Laptop',
        description: 'This is a sample laptop product for testing',
        price: 999.99,
        category: 'Electronics',
        condition: 'New',
        mainImage: 'https://example.com/sample-laptop.jpg',
        seller: adminUser._id,
        sellerName: adminUser.name,
        stock: 10,
        isAvailable: true,
        images: [
          {
            url: 'https://example.com/sample-laptop.jpg',
            altText: 'Sample Laptop'
          }
        ]
      });
      console.log('✅ Created sample product');
    } else {
      console.log(`✅ Products collection already has ${productCount} documents`);
    }

    // Initialize Carts collection
    console.log('Initializing Carts collection...');
    const cartCount = await AtlasCart.countDocuments();
    console.log(`✅ Carts collection has ${cartCount} documents`);

    // Initialize Orders collection
    console.log('Initializing Orders collection...');
    const orderCount = await AtlasOrder.countDocuments();
    console.log(`✅ Orders collection has ${orderCount} documents`);

    // Initialize Wishlists collection
    console.log('Initializing Wishlists collection...');
    const wishlistCount = await AtlasWishlist.countDocuments();
    console.log(`✅ Wishlists collection has ${wishlistCount} documents`);

    console.log('🎉 Atlas database initialization completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during initialization:', error.message);
    process.exit(1);
  }
};

transferData(); 