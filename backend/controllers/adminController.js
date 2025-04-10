const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const User = require('../models/user');
const MenuItem = require('../models/MenuItem');

const getDashboardStats = asyncHandler(async (req, res) => {
  try {
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total revenue
    const revenueResult = await Order.aggregate([
      {
        $match: { status: { $ne: 'cancelled' } }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' }
        }
      }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    // Get active users count
    const activeUsers = await User.countDocuments({
      lastOrderDate: { 
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    });
    
    // Get menu items count
    const menuItems = await MenuItem.countDocuments();
    
    // Get recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
    
    // Get top 5 popular menu items
    const popularItems = await MenuItem.aggregate([
      {
        $lookup: {
          from: 'orderitems',
          localField: '_id',
          foreignField: 'menuItem',
          as: 'orderItems'
        }
      },
      {
        $addFields: {
          orders: { $size: '$orderItems' }
        }
      },
      {
        $sort: { orders: -1 }
      },
      {
        $limit: 5
      },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          orders: 1
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      activeUsers,
      menuItems,
      recentOrders,
      popularItems
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = {
  getDashboardStats
};
