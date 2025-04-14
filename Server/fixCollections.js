const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Cart = require('./models/cartModel');
const Order = require('./models/orderModel');
const Wishlist = require('./models/wishlistModel');

// Load environment variables
dotenv.config();

const fixCollections = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/SPSU_Marketplace';
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB Connected');

    // List all collections in the database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });

    // Get all users
    const users = await User.find({});
    console.log(`Found ${users.length} users`);

    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products`);

    // For each user, ensure they have a cart and wishlist
    for (const user of users) {
      console.log(`Processing user: ${user.name} (${user._id})`);
      
      // Check if user has a cart
      let cart = await Cart.findOne({ user: user._id });
      if (!cart) {
        console.log(`Creating new cart for user ${user.name}`);
        cart = new Cart({
          user: user._id,
          items: []
        });
        await cart.save();
      } else {
        console.log(`User ${user.name} already has a cart with ${cart.items.length} items`);
      }

      // Check if user has a wishlist
      let wishlist = await Wishlist.findOne({ user: user._id });
      if (!wishlist) {
        console.log(`Creating new wishlist for user ${user.name}`);
        wishlist = new Wishlist({
          user: user._id,
          items: []
        });
        await wishlist.save();
      } else {
        console.log(`User ${user.name} already has a wishlist with ${wishlist.items.length} items`);
      }
    }

    // Fix any carts with incorrect structure
    const carts = await Cart.find({});
    console.log(`Found ${carts.length} carts`);

    for (const cart of carts) {
      let modified = false;

      // Check each item in the cart
      for (let i = 0; i < cart.items.length; i++) {
        const item = cart.items[i];

        // If item is missing required fields, try to fix it
        if (!item.name || !item.image || !item.sellerName) {
          try {
            const product = await Product.findById(item.product);
            
            if (product) {
              console.log(`Fixing cart item for product ${product.name}`);
              
              // Update missing fields
              cart.items[i].name = product.name;
              cart.items[i].image = product.mainImage || product.image;
              cart.items[i].price = product.price;
              cart.items[i].seller = product.seller;
              cart.items[i].sellerName = product.sellerName || 'Seller';
              
              modified = true;
            } else {
              // If product doesn't exist, remove the item
              console.log(`Product not found for cart item, removing item`);
              cart.items.splice(i, 1);
              i--; // Adjust index after removal
              modified = true;
            }
          } catch (error) {
            console.error(`Error fixing cart item: ${error.message}`);
          }
        }
      }

      if (modified) {
        await cart.save();
        console.log(`Updated cart for user ${cart.user}`);
      }
    }

    // Fix any wishlists with incorrect structure
    const wishlists = await Wishlist.find({});
    console.log(`Found ${wishlists.length} wishlists`);

    for (const wishlist of wishlists) {
      let modified = false;

      // Check each item in the wishlist
      for (let i = 0; i < wishlist.items.length; i++) {
        const item = wishlist.items[i];

        // If item is missing required fields, try to fix it
        if (!item.name || !item.image || !item.category) {
          try {
            const product = await Product.findById(item.product);
            
            if (product) {
              console.log(`Fixing wishlist item for product ${product.name}`);
              
              // Update missing fields
              wishlist.items[i].name = product.name;
              wishlist.items[i].image = product.mainImage || product.image;
              wishlist.items[i].price = product.price;
              wishlist.items[i].category = product.category;
              wishlist.items[i].seller = product.seller;
              
              modified = true;
            } else {
              // If product doesn't exist, remove the item
              console.log(`Product not found for wishlist item, removing item`);
              wishlist.items.splice(i, 1);
              i--; // Adjust index after removal
              modified = true;
            }
          } catch (error) {
            console.error(`Error fixing wishlist item: ${error.message}`);
          }
        }
      }

      if (modified) {
        await wishlist.save();
        console.log(`Updated wishlist for user ${wishlist.user}`);
      }
    }

    console.log('Collections fixed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

fixCollections(); 