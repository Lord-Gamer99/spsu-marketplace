# SPSU Marketplace

A full-stack marketplace application for Sri Pratap Singh University.

## Features

- User authentication (login, register, forgot password)
- Product listings with search, filtering, and categories
- Shopping cart and checkout functionality
- User profiles with order history
- Modern, responsive UI

## Technologies Used

- **Frontend**: React, React Router, React Icons
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)

## Deployment Instructions

### Prerequisites

- Node.js >= 14
- MongoDB instance (local or cloud-based)
- Git

### Option 1: Local Deployment

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/spsu-marketplace.git
   cd spsu-marketplace
   ```

2. Install dependencies:
   ```
   npm run install-all
   ```

3. Configure MongoDB in .env file:
   ```
   MONGODB_URI=mongodb://localhost:27017/SPSU_Marketplace
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

4. Build the React app:
   ```
   npm run build
   ```

5. Start the server:
   ```
   npm start
   ```

6. Access the application at http://localhost:5000

### Option 2: Cloud Deployment (Heroku)

1. Create a Heroku account and install the Heroku CLI
2. Login to Heroku and create a new app:
   ```
   heroku login
   heroku create spsu-marketplace
   ```

3. Add a MongoDB add-on or connect to your MongoDB Atlas instance:
   ```
   heroku addons:create mongodb:sandbox
   ```
   Or set environment variables manually:
   ```
   heroku config:set MONGODB_URI=your_mongodb_connection_string
   heroku config:set JWT_SECRET=your_secret_key
   ```

4. Push to Heroku:
   ```
   git push heroku main
   ```

5. Open the application:
   ```
   heroku open
   ```

## Mobile Access

The application is designed to work on all devices, including mobile phones and tablets. After deployment, the application can be accessed from any device by visiting the server's URL or IP address.

## Development

To run the application in development mode:

```
npm run dev
```

This will start both the backend server and React development server concurrently.

## Troubleshooting

- **MongoDB Connection Issues**: Ensure MongoDB is running and the connection string is correct in the .env file.
- **API Errors**: Check the server logs for detailed error messages.
- **Build Errors**: Make sure all dependencies are installed correctly with `npm run install-all`.

## License

[MIT License](LICENSE)

## Contributors

- Your Name
- Other contributors 