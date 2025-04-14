# SPSU Marketplace Deployment Checklist

## Database Configuration
- [ ] Update MongoDB connection string in `.env` file to use MongoDB Atlas instead of local MongoDB:
  ```
  MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/SPSU_Marketplace?retryWrites=true&w=majority
  ```
- [ ] Create MongoDB Atlas account if you don't have one (https://www.mongodb.com/cloud/atlas)
- [ ] Create a new cluster and database user with appropriate permissions
- [ ] Whitelist all IP addresses (0.0.0.0/0) in Network Access for public deployment
- [ ] Test database connection with updated URI locally before deploying

## Authentication & Security
- [ ] Ensure JWT_SECRET is set in .env file (currently using 'spsu_marketplace_secret_key')
- [ ] Consider using a more complex secret for production deployment
- [ ] Verify that authentication middleware is working properly
- [ ] Test forgot password functionality with updated email delivery service
- [ ] Implement proper password reset flow in production (current implementation only logs OTP to console)

## Cross-Device Accessibility
- [ ] Test responsive design on multiple devices and screen sizes
- [ ] Verify API routes use relative paths instead of hardcoded localhost URLs
- [ ] Update Client's `package.json` proxy setting if needed (currently set to "http://localhost:5000")
- [ ] Test image uploads and ensure they're properly stored and retrieved

## Collections & Models
- [ ] Run `node Server/fixCollections.js` to ensure all collections are properly set up
- [ ] Verify all required models are correctly defined:
  - User
  - Product
  - Cart
  - Order
  - Wishlist
- [ ] Run `node Server/config/seeder.js` to populate initial data if needed

## Deployment Platform Configuration
- [ ] Choose deployment platform (Heroku, Vercel, Render, etc.)
- [ ] Set up environment variables on deployment platform
- [ ] Configure build commands according to package.json scripts
- [ ] Set up automatic deployment from your repository (optional)

## Final Checks
- [ ] Run `npm run build` in Client directory to verify build succeeds without errors
- [ ] Test the full application locally with production configuration
- [ ] Verify all routes and endpoints are working correctly
- [ ] Check CORS settings in `Server/server.js` (currently set to allow all origins '*')
- [ ] Update to specific origins for production if necessary

## Post-Deployment
- [ ] Test login/register functionality on live site
- [ ] Verify product listings and image display
- [ ] Test cart and checkout process
- [ ] Monitor server logs for any errors
- [ ] Set up monitoring tools if necessary 