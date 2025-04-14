/**
 * SPSU Marketplace Deployment Helper
 * 
 * This script helps prepare your application for deployment by:
 * 1. Checking MongoDB connection
 * 2. Validating all required models and collections
 * 3. Building the client application
 * 4. Generating a deployment package
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Print a colored message
const print = (message, color = colors.reset) => {
  console.log(`${color}${message}${colors.reset}`);
};

// Print a section header
const printHeader = (title) => {
  console.log('\n');
  print('='.repeat(title.length + 6), colors.cyan);
  print(`== ${title} ==`, colors.cyan + colors.bright);
  print('='.repeat(title.length + 6), colors.cyan);
};

// Check if MongoDB URI is configured for production
const checkMongoDbUri = () => {
  printHeader('Checking MongoDB Configuration');
  
  const mongoUri = process.env.MONGODB_URI;
  
  if (!mongoUri) {
    print('❌ MONGODB_URI not found in .env file', colors.red);
    return false;
  }
  
  print(`🔍 Found MongoDB URI: ${mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`, colors.yellow);
  
  if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
    print('⚠️ Warning: Using local MongoDB. For production, use MongoDB Atlas.', colors.yellow);
    return true; // Continue but with warning
  }
  
  if (mongoUri.includes('mongodb+srv://')) {
    print('✅ Using MongoDB Atlas connection string - Good for production!', colors.green);
    return true;
  }
  
  print('⚠️ MongoDB URI does not appear to be a MongoDB Atlas URI.', colors.yellow);
  return true; // Continue with warning
};

// Test MongoDB connection
const testMongoDbConnection = async () => {
  printHeader('Testing MongoDB Connection');
  
  try {
    print('🔄 Connecting to MongoDB...', colors.yellow);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    
    print('✅ Successfully connected to MongoDB!', colors.green);
    
    // Check for collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    print(`📋 Found ${collections.length} collections:`, colors.green);
    collections.forEach(collection => {
      print(`   - ${collection.name}`, colors.green);
    });
    
    // Check if all required collections exist
    const requiredCollections = ['users', 'products', 'carts', 'orders', 'wishlists'];
    const missingCollections = requiredCollections.filter(rc => 
      !collections.some(c => c.name === rc || c.name === rc.slice(0, -1))
    );
    
    if (missingCollections.length > 0) {
      print(`⚠️ Missing collections: ${missingCollections.join(', ')}`, colors.yellow);
      print('   Consider running: node Server/fixCollections.js', colors.yellow);
    } else {
      print('✅ All required collections exist!', colors.green);
    }
    
    await mongoose.disconnect();
    return true;
  } catch (error) {
    print(`❌ MongoDB Connection Error: ${error.message}`, colors.red);
    print('   Please check your MONGODB_URI in .env file', colors.red);
    return false;
  }
};

// Check JWT secret
const checkJwtSecret = () => {
  printHeader('Checking JWT Configuration');
  
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!jwtSecret) {
    print('❌ JWT_SECRET not found in .env file', colors.red);
    return false;
  }
  
  if (jwtSecret === 'spsu_marketplace_secret_key' || jwtSecret.length < 20) {
    print('⚠️ Warning: Using default or weak JWT secret.', colors.yellow);
    print('   Consider using a stronger random string for production.', colors.yellow);
    return true; // Continue but with warning
  }
  
  print('✅ JWT secret is configured properly.', colors.green);
  return true;
};

// Verify client proxy setting
const checkClientProxy = () => {
  printHeader('Checking Client Proxy Configuration');
  
  const clientPackageJsonPath = path.join(__dirname, 'Client', 'package.json');
  
  try {
    const packageJsonContent = fs.readFileSync(clientPackageJsonPath, 'utf8');
    const packageJson = JSON.parse(packageJsonContent);
    
    if (packageJson.proxy && packageJson.proxy.includes('localhost')) {
      print(`⚠️ Client proxy is set to: ${packageJson.proxy}`, colors.yellow);
      print('   This needs to be updated or removed for production deployment.', colors.yellow);
      return true; // Continue but with warning
    }
    
    print('✅ Client proxy configuration is suitable for production.', colors.green);
    return true;
  } catch (error) {
    print(`❌ Error checking client proxy: ${error.message}`, colors.red);
    return false;
  }
};

// Build client
const buildClient = () => {
  printHeader('Building Client Application');
  
  try {
    print('🔄 Installing client dependencies...', colors.yellow);
    execSync('cd Client && npm install', { stdio: 'inherit' });
    
    print('🔄 Building client application...', colors.yellow);
    execSync('cd Client && npm run build', { stdio: 'inherit' });
    
    print('✅ Client built successfully!', colors.green);
    return true;
  } catch (error) {
    print(`❌ Error building client: ${error.message}`, colors.red);
    return false;
  }
};

// Check CORS configuration
const checkCorsConfig = () => {
  printHeader('Checking CORS Configuration');
  
  const serverJsPath = path.join(__dirname, 'Server', 'server.js');
  
  try {
    const serverContent = fs.readFileSync(serverJsPath, 'utf8');
    
    if (serverContent.includes("origin: '*'")) {
      print('⚠️ CORS is configured to allow all origins (*)', colors.yellow);
      print('   This is fine for development but consider restricting origins in production.', colors.yellow);
      return true; // Continue but with warning
    }
    
    print('✅ CORS is not wide open to all origins.', colors.green);
    return true;
  } catch (error) {
    print(`❌ Error checking CORS config: ${error.message}`, colors.red);
    return false;
  }
};

// Create deployment package
const createDeploymentPackage = () => {
  printHeader('Generating Deployment Summary');
  
  // Create a deployment summary
  const summaryPath = path.join(__dirname, 'deployment-summary.md');
  
  try {
    const summary = `# SPSU Marketplace Deployment Summary
Generated on: ${new Date().toLocaleString()}

## Pre-Deployment Checklist
- [x] MongoDB connection tested
- [x] JWT configuration verified
- [x] Client application built
- [x] CORS configuration checked

## Deployment Instructions
1. Ensure all environment variables are set on your deployment platform:
   - MONGODB_URI
   - JWT_SECRET
   - PORT (optional, defaults to 5000)

2. Upload or push your code to the deployment platform.

3. Set your build command to:
   \`\`\`
   npm install && cd Client && npm install && npm run build
   \`\`\`

4. Set your start command to:
   \`\`\`
   node Server/server.js
   \`\`\`

5. After deployment, run the following if needed:
   - To seed initial data: \`node Server/config/seeder.js\`
   - To fix collections: \`node Server/fixCollections.js\`

## Post-Deployment Verification
- [ ] Verify login and registration
- [ ] Verify product listings are displayed
- [ ] Verify cart functionality
- [ ] Verify checkout process
- [ ] Verify admin features (if applicable)
`;

    fs.writeFileSync(summaryPath, summary);
    print(`✅ Deployment summary created at: ${summaryPath}`, colors.green);
    return true;
  } catch (error) {
    print(`❌ Error creating deployment summary: ${error.message}`, colors.red);
    return false;
  }
};

// Main function
const main = async () => {
  printHeader('SPSU Marketplace Deployment Helper');
  
  let success = true;
  
  // Run all checks
  success = checkMongoDbUri() && success;
  success = await testMongoDbConnection() && success;
  success = checkJwtSecret() && success;
  success = checkClientProxy() && success;
  success = checkCorsConfig() && success;
  
  // Build if all checks pass
  if (success) {
    success = buildClient() && success;
  }
  
  // Create deployment package if build successful
  if (success) {
    success = createDeploymentPackage() && success;
  }
  
  // Final result
  if (success) {
    printHeader('Deployment Preparation Complete');
    print('✅ Your application is ready for deployment!', colors.green);
    print('   See deployment-summary.md for next steps.', colors.green);
  } else {
    printHeader('Deployment Preparation Failed');
    print('❌ Please fix the issues above before deploying.', colors.red);
  }
};

// Run the main function
main().catch(error => {
  print(`❌ Unexpected error: ${error.message}`, colors.red);
}); 