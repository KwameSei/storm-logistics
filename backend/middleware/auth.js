import jwt from 'jsonwebtoken';
import SuperAdmin from '../models/superadminSchema.js';
import User from '../models/userSchema.js';

export const superAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Unauthorized: Missing or invalid token format'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Unauthorized: Missing token'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.token = token;
    // req.SuperAdmin = decoded;
    req.SuperAdmin = await SuperAdmin.findById(decoded._id).select('-password');

    next();
  } catch (error) {
    console.error('Error authenticating user:', error.message);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};


export const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        status: 401,
        message: 'Unauthorized: Missing or invalid token format'
      });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp < currentTimestamp) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: "Unauthorized: Token expired"
        });
      }

      req.token = token;
      req.User = decoded;

      next();
    } catch (error) {
      console.error('Error authenticating user:', error.message);
      return res.status(500).json({
        success: false,
        status: 500,
        message: 'Internal server error'
      });
    }
  } catch (error) {
    console.error('Error in userAuth middleware:', error);
    return res.status(500).json({
      success: false,
      status: 500,
      message: 'Internal server error'
    });
  }
};

// Create authorization middleware for both super admin and user
export const authorization = (roles) => {
  return (req, res, next) => {
    try {
      // Check if the request object contains either 'superAdmin' or 'user'
      const authUser = req.SuperAdmin || req.User;

      // If no authenticated user is found, return unauthorized
      if (!authUser) {
        return res.status(401).json({
          success: false,
          status: 401,
          message: 'Unauthorized: User not authenticated'
        });
      }

      // Check if the authenticated user's role matches any of the allowed roles
      if (!roles.includes(authUser.role)) {
        return res.status(403).json({
          success: false,
          status: 403,
          message: 'Forbidden: Insufficient privileges to access this route'
        });
      }

      // If authorized, proceed to the next middleware or route handler
      next();
    } catch (error) {
      console.error('Error in authorization middleware:', error);
      return res.status(500).json({
        success: false,
        status: 500,
        message: 'Internal server error'
      });
    }
  };
};
