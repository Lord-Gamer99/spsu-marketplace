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
    // Connect to local MongoDB
    const localURI = process.env.MONGODB_URI; // Use Atlas URI instead of local
    const localConn = await mongoose.createConnection(localURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('✅ Connected to MongoDB Atlas (source)');

    // Connect to MongoDB Atlas (same database, but we keep the code structure for future updates)
    const atlasURI = process.env.MONGODB_URI;
    const atlasConn = await mongoose.createConnection(atlasURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true,
      }
    });
    console.log('✅ Connected to MongoDB Atlas (destination)');

    // Register models for local connection
    const LocalUser = localConn.model('User', User.schema);
    const LocalProduct = localConn.model('Product', Product.schema);
    const LocalCart = localConn.model('Cart', Cart.schema);
    const LocalOrder = localConn.model('Order', Order.schema);
    const LocalWishlist = localConn.model('Wishlist', Wishlist.schema);

    // Register models for Atlas connection
    const AtlasUser = atlasConn.model('User', User.schema);
    const AtlasProduct = atlasConn.model('Product', Product.schema);
    const AtlasCart = atlasConn.model('Cart', Cart.schema);
    const AtlasOrder = atlasConn.model('Order', Order.schema);
    const AtlasWishlist = atlasConn.model('Wishlist', Wishlist.schema);

    // Transfer Users
    console.log('Transferring Users...');
    const users = await LocalUser.find({});
    await AtlasUser.deleteMany({});
    await AtlasUser.insertMany(users);
    console.log(`✅ Transferred ${users.length} users`);

    // Transfer Products
    console.log('Transferring Products...');
    const products = await LocalProduct.find({});
    await AtlasProduct.deleteMany({});
    await AtlasProduct.insertMany(products);
    console.log(`✅ Transferred ${products.length} products`);

    // Transfer Carts
    console.log('Transferring Carts...');
    const carts = await LocalCart.find({});
    await AtlasCart.deleteMany({});
    await AtlasCart.insertMany(carts);
    console.log(`✅ Transferred ${carts.length} carts`);

    // Transfer Orders
    console.log('Transferring Orders...');
    const orders = await LocalOrder.find({});
    await AtlasOrder.deleteMany({});
    await AtlasOrder.insertMany(orders);
    console.log(`✅ Transferred ${orders.length} orders`);

    // Transfer Wishlists
    console.log('Transferring Wishlists...');
    const wishlists = await LocalWishlist.find({});
    await AtlasWishlist.deleteMany({});
    await AtlasWishlist.insertMany(wishlists);
    console.log(`✅ Transferred ${wishlists.length} wishlists`);

    console.log('🎉 Data transfer completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during data transfer:', error.message);
    process.exit(1);
  }
};

transferData(); 