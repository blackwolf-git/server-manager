const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    // التحقق من وجود التوكن في الرأس
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error('Authentication required');
    }

    // التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    // إضافة المستخدم إلى الطلب لاستخدامه في المتحكمات
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message
    });
  }
};
