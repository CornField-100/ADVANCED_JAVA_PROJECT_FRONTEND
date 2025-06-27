/**
 * BACKEND FIXES NEEDED
 *
 * Based on the 500 error you're getting, here's what you need to add/fix in your backend:
 */

// 1. Add this simple health check endpoint to your backend server
// Add this to your main server file (app.js, server.js, or index.js):

/*
// Health check endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      login: '/api/users/login',
      signup: '/api/users/signup',
      products: '/api/product/getAllProduct'
    }
  });
});
*/

// 2. Fix your login endpoint - here's what it should look like:

/*
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/users/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }
    
    // Find user by email (adjust based on your database setup)
    const user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        email: user.email,
        role: user.role || 'user',
        firstName: user.firstName,
        lastName: user.lastName
      },
      process.env.JWT_SECRET || 'your-secret-key', // Use environment variable!
      { expiresIn: '24h' }
    );
    
    console.log('Login successful for:', email);
    
    // Return token
    res.json({ 
      token: token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role || 'user'
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'An error occurred during the login process.',
      error: error.message // Remove this in production
    });
  }
});
*/

// 3. Add CORS middleware if you haven't already:

/*
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));
*/

// 4. Add body parser middleware:

/*
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
*/

// 5. Add error handling middleware:

/*
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
*/

// 6. Make sure your User model/schema includes the role field:

/*
// If using Mongoose:
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  imageUrl: String
}, { timestamps: true });
*/

export default {}; // This file is just documentation
