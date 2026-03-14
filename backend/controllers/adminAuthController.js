const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

// ============================================
// ADMIN LOGIN
// POST /api/admin/login
// ============================================
exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Get admin user from database
    const [users] = await pool.query(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    const admin = users[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Update last login
    await pool.query(
      'UPDATE admin_users SET last_login = NOW() WHERE admin_id = ?',
      [admin.admin_id]
    );

    // Create session
    req.session.adminId = admin.admin_id;
    req.session.username = admin.username;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.admin_id,
        username: admin.username,
        email: admin.email
      }
    });

  } catch (error) {
    next(error);
  }
};

// ============================================
// ADMIN LOGOUT
// POST /api/admin/logout
// ============================================
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Could not log out'
      });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  });
};

// ============================================
// CHECK AUTH STATUS
// GET /api/admin/check
// ============================================
exports.checkAuth = (req, res) => {
  if (req.session.adminId) {
    res.status(200).json({
      success: true,
      isAuthenticated: true,
      admin: {
        id: req.session.adminId,
        username: req.session.username
      }
    });
  } else {
    res.status(200).json({
      success: true,
      isAuthenticated: false
    });
  }
};