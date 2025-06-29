// =====================================================
// 🛍️ ORDERS API ENDPOINTS FOR BACKEND
// =====================================================
// Add these endpoints to your backend server (e.g., app.js, server.js)

// Import required modules at the top of your backend file:
// const express = require('express');
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');

// =====================================================
// 📋 ORDER SCHEMA (Add to your models folder)
// =====================================================

/*
// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    title: String,
    brand: String,
    price: Number,
    quantity: Number,
    imageUrl: String
  }],
  shippingInfo: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'US' }
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'paypal', 'apple', 'google', 'crypto'],
    default: 'card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'paid'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  subtotal: Number,
  tax: Number,
  shipping: Number,
  discount: { type: Number, default: 0 },
  total: Number,
  orderNotes: String,
  trackingNumber: String,
  estimatedDelivery: Date,
  deliveredAt: Date
}, {
  timestamps: true // This adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('Order', orderSchema);
*/

// =====================================================
// 🔐 AUTHENTICATION MIDDLEWARE
// =====================================================

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

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// =====================================================
// 📦 ORDERS API ENDPOINTS
// =====================================================

// GET all orders (admin only)
app.get('/api/orders', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📡 GET /api/orders - Fetching all orders');
    
    // Optional query parameters for filtering
    const { 
      status, 
      paymentStatus, 
      startDate, 
      endDate,
      userId,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;
    if (userId) filter.userId = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Fetch orders with population
    const orders = await Order.find(filter)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'title brand imageUrl')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(); // Convert to plain objects for better performance

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);
    
    console.log(`✅ Found ${orders.length} orders (${totalOrders} total)`);

    // Return orders with pagination info
    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasNext: skip + orders.length < totalOrders,
        hasPrev: parseInt(page) > 1
      },
      filters: filter
    });

  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch orders',
      error: error.message 
    });
  }
});

// GET single order by ID
app.get('/api/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`📡 GET /api/orders/${orderId}`);

    const order = await Order.findOne({
      $or: [
        { orderId: orderId },
        { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }
      ]
    })
    .populate('userId', 'firstName lastName email')
    .populate('items.productId', 'title brand imageUrl price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user can access this order (admin or order owner)
    if (req.user.role !== 'admin' && order.userId._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    console.log(`✅ Order found: ${order.orderId}`);
    res.json(order);

  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order',
      error: error.message 
    });
  }
});

// POST create new order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    console.log('📡 POST /api/orders - Creating new order');
    console.log('Order data received:', req.body);

    const {
      items,
      shippingInfo,
      paymentMethod,
      paymentStatus = 'paid',
      subtotal,
      tax,
      shipping,
      total,
      orderNotes
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    if (!shippingInfo || !shippingInfo.firstName || !shippingInfo.email) {
      return res.status(400).json({ message: 'Shipping information is incomplete' });
    }

    // Generate unique order ID
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Create new order
    const newOrder = new Order({
      orderId,
      userId: req.user.id,
      items: items.map(item => ({
        productId: item.productId,
        title: item.title,
        brand: item.brand,
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        imageUrl: item.imageUrl
      })),
      shippingInfo,
      paymentMethod,
      paymentStatus,
      status: 'pending',
      subtotal: parseFloat(subtotal),
      tax: parseFloat(tax),
      shipping: parseFloat(shipping),
      total: parseFloat(total),
      orderNotes
    });

    const savedOrder = await newOrder.save();
    
    // Populate the saved order before returning
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate('userId', 'firstName lastName email')
      .populate('items.productId', 'title brand imageUrl');

    console.log(`✅ Order created successfully: ${savedOrder.orderId}`);

    res.status(201).json(populatedOrder);

  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(500).json({ 
      message: 'Failed to create order',
      error: error.message 
    });
  }
});

// PATCH update order status (admin only)
app.patch('/api/orders/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const updates = req.body;
    
    console.log(`📡 PATCH /api/orders/${orderId}`, updates);

    // Find and update the order
    const updatedOrder = await Order.findOneAndUpdate(
      {
        $or: [
          { orderId: orderId },
          { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }
        ]
      },
      { 
        ...updates,
        updatedAt: new Date()
      },
      { new: true } // Return updated document
    )
    .populate('userId', 'firstName lastName email')
    .populate('items.productId', 'title brand imageUrl');

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`✅ Order updated: ${updatedOrder.orderId}`);
    res.json(updatedOrder);

  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(500).json({ 
      message: 'Failed to update order',
      error: error.message 
    });
  }
});

// DELETE order (admin only)
app.delete('/api/orders/:orderId', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log(`📡 DELETE /api/orders/${orderId}`);

    const deletedOrder = await Order.findOneAndDelete({
      $or: [
        { orderId: orderId },
        { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }
      ]
    });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    console.log(`✅ Order deleted: ${deletedOrder.orderId}`);
    res.json({ 
      message: 'Order deleted successfully',
      orderId: deletedOrder.orderId 
    });

  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ 
      message: 'Failed to delete order',
      error: error.message 
    });
  }
});

// GET orders by user (for customer order history)
app.get('/api/orders/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(`📡 GET /api/orders/user/${userId}`);

    // Check if user can access these orders (admin or order owner)
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const orders = await Order.find({ userId })
      .populate('items.productId', 'title brand imageUrl price')
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${orders.length} orders for user ${userId}`);
    res.json(orders);

  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ 
      message: 'Failed to fetch user orders',
      error: error.message 
    });
  }
});

// GET order statistics (admin only)
app.get('/api/orders/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    console.log('📡 GET /api/orders/stats');

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfYear = new Date(today.getFullYear(), 0, 1);

    const [
      totalOrders,
      todayOrders,
      monthOrders,
      yearOrders,
      statusStats,
      revenueStats
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: startOfToday } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ createdAt: { $gte: startOfYear } }),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            avgOrderValue: { $avg: '$total' }
          }
        }
      ])
    ]);

    const stats = {
      totalOrders,
      todayOrders,
      monthOrders,
      yearOrders,
      statusBreakdown: statusStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      revenue: {
        total: revenueStats[0]?.totalRevenue || 0,
        average: revenueStats[0]?.avgOrderValue || 0
      }
    };

    console.log('✅ Order statistics calculated');
    res.json(stats);

  } catch (error) {
    console.error('❌ Error calculating order stats:', error);
    res.status(500).json({ 
      message: 'Failed to calculate order statistics',
      error: error.message 
    });
  }
});

// =====================================================
// 📧 OPTIONAL: Email notification webhook (if you use email service)
// =====================================================

app.post('/api/orders/:orderId/notify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { type = 'status_update' } = req.body;

    const order = await Order.findOne({
      $or: [
        { orderId: orderId },
        { _id: mongoose.Types.ObjectId.isValid(orderId) ? orderId : null }
      ]
    }).populate('userId', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Here you would integrate with your email service
    // Example: await sendOrderUpdateEmail(order, type);

    console.log(`📧 Notification sent for order ${order.orderId}: ${type}`);
    res.json({ message: 'Notification sent successfully' });

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ 
      message: 'Failed to send notification',
      error: error.message 
    });
  }
});

// =====================================================
// 🚀 CORS CONFIGURATION (if needed)
// =====================================================

/*
// Add this before your routes if you're having CORS issues:

const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
    'https://frontendjava.netlify.app' // Your production domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
*/

console.log('🛍️ Orders API endpoints configured successfully!');
console.log('Available endpoints:');
console.log('  GET    /api/orders           - Get all orders (admin)');
console.log('  GET    /api/orders/:id       - Get single order');
console.log('  POST   /api/orders           - Create new order');
console.log('  PATCH  /api/orders/:id       - Update order (admin)');
console.log('  DELETE /api/orders/:id       - Delete order (admin)');
console.log('  GET    /api/orders/user/:id  - Get user orders');
console.log('  GET    /api/orders/stats     - Get order statistics (admin)');
