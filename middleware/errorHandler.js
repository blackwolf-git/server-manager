const logger = require('../utils/logger');

exports.errorHandler = (err, req, res, next) => {
  // تسجيل الخطأ
  logger.error(err.stack);

  // تحديد رسالة الخطأ المناسبة
  let message = err.message;
  let statusCode = err.statusCode || 500;

  // معالجة أخطاء Sequelize
  if (err.name === 'SequelizeValidationError') {
    message = err.errors.map(e => e.message).join(', ');
    statusCode = 400;
  } else if (err.name === 'SequelizeUniqueConstraintError') {
    message = 'Duplicate entry: ' + err.errors.map(e => e.message).join(', ');
    statusCode = 400;
  }

  // إرسال الرد المناسب
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
