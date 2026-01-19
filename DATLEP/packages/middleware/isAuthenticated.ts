import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, Seller } from '@datlep/database';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extract token from cookies or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { 
      id: string, 
      role: "user" | "seller",
      email?: string 
    };
    
    if (!decoded) {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid token' 
      });
    }

    let account = null;

    // Find account based on role
    if (decoded.role === 'seller') {
      account = await Seller.findById(decoded.id).select('-password').lean();
      
      if (!account) {
        return res.status(401).json({ 
          success: false,
          message: 'Unauthorized: Seller account not found' 
        });
      }

      // Add seller-specific checks if needed
      if (!account.emailVerified) {
        return res.status(403).json({ 
          success: false,
          message: 'Please verify your email to access this resource' 
        });
      }

      // Add seller-specific properties to the request object
      req.user = {
        ...account,
        _id: account._id,
        role: 'seller',
        isSeller: true
      };

    } else if (decoded.role === 'user') {
      account = await User.findById(decoded.id).select('-password').lean();
      
      if (!account) {
        return res.status(401).json({ 
          success: false,
          message: 'Unauthorized: User account not found' 
        });
      }

      // Add user-specific properties to the request object
      req.user = {
        ...account,
        _id: account._id,
        role: 'user',
        isUser: true
      };

    } else {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid account type' 
      });
    }

    return next();

  } catch (error: any) {
    // Handle different JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Token has expired' 
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        message: 'Unauthorized: Invalid token signature' 
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication' 
    });
  }
};

export default isAuthenticated;