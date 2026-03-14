// Middleware to check if user is authenticated
exports.isAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  
  return res.status(401).json({
    success: false,
    message: 'Unauthorized. Please login as admin.'
  });
};