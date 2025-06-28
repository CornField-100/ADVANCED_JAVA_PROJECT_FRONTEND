// Backend API endpoints that need to be implemented
// Copy this code to your backend server (e.g., app.js, server.js, or routes/users.js)

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// USER MANAGEMENT ENDPOINTS FOR /api/users
// ============================================

// GET /api/users - Fetch all users (admin only)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/users - User:', req.user);
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Fetch users from your database (adjust based on your database setup)
    const users = await User.find().select('-password'); // Exclude passwords
    
    // Format users for frontend
    const formattedUsers = users.map(user => ({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role || 'user',
      status: user.status || 'active',
      createdAt: user.createdAt,
      lastLogin: user.lastLogin || null,
      imageUrl: user.imageUrl || null,
      orders: user.orders || 0,
      totalSpent: user.totalSpent || 0,
      loginCount: user.loginCount || 0,
      lastActiveAt: user.lastActiveAt || null,
      location: user.location || { country: "Unknown", city: "Unknown" },
      deviceInfo: user.deviceInfo || { type: "unknown", browser: "unknown" },
      verificationStatus: user.verificationStatus || "unverified",
      twoFactorEnabled: user.twoFactorEnabled || false
    }));
    
    console.log(`✅ Returning ${formattedUsers.length} users`);
    res.json(formattedUsers);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// POST /api/users - Create new user (admin only)
app.post('/api/users', authenticateToken, async (req, res) => {
  try {
    console.log('POST /api/users - Creating user');
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { firstName, lastName, email, password, role, status } = req.body;
    
    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role || 'user',
      status: status || 'active',
      createdAt: new Date(),
      loginCount: 0,
      orders: 0,
      totalSpent: 0
    });
    
    const savedUser = await newUser.save();
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    console.log('✅ User created:', userResponse.email);
    res.status(201).json(userResponse);
  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Failed to create user', error: error.message });
  }
});

// PATCH /api/users/:id - Update user (admin only)
app.patch('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    console.log('PATCH /api/users/:id - Updating user');
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    const updates = req.body;
    
    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    // Add update timestamp
    updates.updatedAt = new Date();
    
    const updatedUser = await User.findByIdAndUpdate(id, updates, { 
      new: true,
      runValidators: true 
    }).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User updated:', updatedUser.email);
    res.json(updatedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    res.status(500).json({ message: 'Failed to update user', error: error.message });
  }
});

// DELETE /api/users/:id - Delete user (admin only)
app.delete('/api/users/:id', authenticateToken, async (req, res) => {
  try {
    console.log('DELETE /api/users/:id - Deleting user');
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const { id } = req.params;
    
    // Prevent deletion of the current user
    if (req.user.userId === id || req.user.id === id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('✅ User deleted:', deletedUser.email);
    res.json({ message: 'User deleted successfully', deletedUser: { id: deletedUser._id, email: deletedUser.email } });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: 'Failed to delete user', error: error.message });
  }
});

// GET /api/users/stats - Get user statistics (admin only)
app.get('/api/users/stats', authenticateToken, async (req, res) => {
  try {
    console.log('GET /api/users/stats');
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    // Calculate new users this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth }
    });
    
    const stats = {
      totalUsers,
      activeUsers,
      adminUsers,
      newUsersThisMonth,
      inactiveUsers: totalUsers - activeUsers,
      userGrowthRate: totalUsers > 0 ? Math.round((newUsersThisMonth / totalUsers) * 100) : 0,
      activeRate: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    };
    
    console.log('✅ User stats:', stats);
    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching user stats:', error);
    res.status(500).json({ message: 'Failed to fetch user statistics', error: error.message });
  }
});

// Health check endpoint for backend connectivity testing
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Backend is working!', 
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      userStats: '/api/users/stats',
      login: '/api/users/login',
      signup: '/api/users/signup'
    }
  });
});

module.exports = {
  authenticateToken
};

/*
SETUP INSTRUCTIONS:

1. Install required dependencies in your backend:
   npm install bcrypt jsonwebtoken

2. Make sure you have the User model/schema set up. Example:
   
   const userSchema = new mongoose.Schema({
     firstName: { type: String, required: true },
     lastName: { type: String, required: true },
     email: { type: String, required: true, unique: true },
     password: { type: String, required: true },
     role: { type: String, enum: ['user', 'admin'], default: 'user' },
     status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
     createdAt: { type: Date, default: Date.now },
     lastLogin: { type: Date },
     imageUrl: { type: String },
     orders: { type: Number, default: 0 },
     totalSpent: { type: Number, default: 0 },
     loginCount: { type: Number, default: 0 },
     lastActiveAt: { type: Date },
     location: {
       country: { type: String },
       city: { type: String }
     },
     deviceInfo: {
       type: { type: String },
       browser: { type: String }
     },
     verificationStatus: { type: String, default: 'unverified' },
     twoFactorEnabled: { type: Boolean, default: false }
   });

3. Set up CORS to allow your frontend:
   app.use(cors({
     origin: 'http://localhost:5173',
     credentials: true
   }));

4. Add body parser middleware:
   app.use(express.json());
   app.use(express.urlencoded({ extended: true }));

5. Set your JWT_SECRET environment variable or replace 'your-secret-key'

6. Test the endpoint:
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3001/api/users
*/
