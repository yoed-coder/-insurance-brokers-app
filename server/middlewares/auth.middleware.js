const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify JWT token from Authorization header
 */
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      console.warn('🚫 No Authorization header provided');
      return res.status(403).json({
        status: 'fail',
        message: 'No token provided',
      });
    }

    // Expect: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.warn('🚫 Invalid token format received:', authHeader);
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid token format. Expected Bearer <token>',
      });
    }

    const token = parts[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.error('🚫 JWT verification failed:', err.message);

        // Specifically handle expired token
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            status: 'fail',
            message: 'Session expired. Please login again.',
          });
        }

        return res.status(401).json({
          status: 'fail',
          message: 'Unauthorized or invalid token',
        });
      }

      // ✅ Attach decoded payload to req.employee (as expected by controllers)
      req.employee = decoded;
      console.log('✅ JWT verified for employee:', decoded.employee_email);

      next();
    });
  } catch (error) {
    console.error('🔥 Token verification error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error during token verification',
    });
  }
};

/**
 * Middleware to allow only Admin role (company_role_id = 3)
 */
const isAdmin = (req, res, next) => {
  try {
    const roleId = req.employee?.company_role_id;

    if (roleId === 3) {
      return next();
    } else {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. Admins only.',
      });
    }
  } catch (error) {
    console.error('🔥 Admin check error:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Error while verifying admin access',
    });
  }
};

module.exports = {
  verifyToken,
  isAdmin,
};
