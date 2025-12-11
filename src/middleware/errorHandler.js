/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => e.message);
    console.error('❌ Validation errors:', errors);
    console.error('❌ Full error:', JSON.stringify(err, null, 2));
    console.error('❌ Error details:', err);
    return res.status(400).json({
      success: false,
      message: 'Dữ liệu không hợp lệ',
      errors,
      details: err.message, // Add more details
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      success: false,
      message: `${field} đã tồn tại`,
    });
  }

  // Mongoose cast error
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'ID không hợp lệ',
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Lỗi server',
  });
};

export default errorHandler;
