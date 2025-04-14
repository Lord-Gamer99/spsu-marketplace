const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/userModel');
const Product = require('../models/productModel');
const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Wishlist = require('../models/wishlistModel');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SPSU_Marketplace')
  .then(() => console.log('MongoDB Connected for seeding'))
  .catch((err) => {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  });

// Sample Users
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'admin',
    address: '123 Admin Street, Tech City',
    phone: '9876543210'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    address: '456 User Avenue, Student Town',
    phone: '8765432109'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: bcrypt.hashSync('123456', 10),
    role: 'user',
    address: '789 College Road, Campus View',
    phone: '7654321098'
  }
];

// Sample Products
const products = [
  {
    name: 'Engineering Textbooks Set',
    description: 'A complete set of engineering textbooks for first-year students. Includes Mathematics, Physics, and Computer Science books.',
    price: 2500,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTF8fHRleHRib29rc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    condition: 'Used - Like New',
    sellerId: null // Will be set dynamically
  },
  {
    name: 'HP Laptop - 15.6" Display',
    description: 'HP laptop with 8GB RAM, 512GB SSD, and Intel Core i5 processor. Perfect for students. Minor scratches on the bottom.',
    price: 35000,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bGFwdG9wfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    condition: 'Used - Good',
    sellerId: null
  },
  {
    name: 'Scientific Calculator',
    description: 'Texas Instruments TI-84 Plus Graphics Calculator. All functions working perfectly.',
    price: 1200,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8Y2FsY3VsYXRvcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    condition: 'Used - Excellent',
    sellerId: null
  },
  {
    name: 'Study Desk and Chair',
    description: 'Compact study desk with attached bookshelf and comfortable chair. Ideal for small dorm rooms.',
    price: 3500,
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c3R1ZHklMjBkZXNrfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
    condition: 'Used - Good',
    sellerId: null
  },
  {
    name: 'Bicycle - Mountain Bike',
    description: 'Sturdy mountain bike, perfect for commuting around campus. 21-speed with front suspension.',
    price: 5000,
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmljeWNsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    condition: 'Used - Fair',
    sellerId: null
  }
];

// Import Data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Wishlist.deleteMany();

    // Import users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const regularUser = createdUsers[1]._id;
    const secondUser = createdUsers[2]._id;

    // Add user IDs to products
    const sampleProducts = products.map((product, index) => {
      return { 
        ...product, 
        seller: index % 2 === 0 ? adminUser : regularUser,
        sellerName: index % 2 === 0 ? 'Admin User' : 'John Doe',
        mainImage: product.image,
        stock: 10,
        isAvailable: true
      };
    });

    // Import products
    const createdProducts = await Product.insertMany(sampleProducts);

    // Create a cart for the first regular user
    const cart = new Cart({
      user: regularUser,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].mainImage,
          price: createdProducts[0].price,
          quantity: 1,
          seller: createdProducts[0].seller,
          sellerName: createdProducts[0].sellerName
        },
        {
          product: createdProducts[2]._id,
          name: createdProducts[2].name,
          image: createdProducts[2].mainImage,
          price: createdProducts[2].price,
          quantity: 2,
          seller: createdProducts[2].seller,
          sellerName: createdProducts[2].sellerName
        }
      ]
    });
    await cart.save();

    // Create a wishlist for the second user
    const wishlist = new Wishlist({
      user: secondUser,
      items: [
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          image: createdProducts[1].mainImage,
          price: createdProducts[1].price,
          category: createdProducts[1].category,
          seller: createdProducts[1].seller
        },
        {
          product: createdProducts[3]._id,
          name: createdProducts[3].name,
          image: createdProducts[3].mainImage,
          price: createdProducts[3].price,
          category: createdProducts[3].category,
          seller: createdProducts[3].seller
        }
      ]
    });
    await wishlist.save();

    // Create an order for the first regular user
    const order = new Order({
      user: regularUser,
      orderItems: [
        {
          product: createdProducts[4]._id,
          name: createdProducts[4].name,
          image: createdProducts[4].mainImage,
          price: createdProducts[4].price,
          quantity: 1,
          seller: createdProducts[4].seller
        }
      ],
      shippingAddress: {
        fullName: 'John Doe',
        address: users[1].address,
        city: 'Student Town',
        postalCode: '400001',
        state: 'Maharashtra',
        country: 'India',
        phone: users[1].phone
      },
      paymentMethod: 'Cash on Delivery',
      itemsPrice: createdProducts[4].price,
      shippingPrice: 50,
      taxPrice: Math.round(createdProducts[4].price * 0.18),
      totalPrice: createdProducts[4].price + 50 + Math.round(createdProducts[4].price * 0.18),
      status: 'Processing'
    });
    await order.save();

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Destroy Data
const destroyData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Cart.deleteMany();
    await Order.deleteMany();
    await Wishlist.deleteMany();

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 