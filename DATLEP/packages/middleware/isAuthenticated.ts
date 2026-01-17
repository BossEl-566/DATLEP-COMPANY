import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '@datlep/database';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}


const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
try {
   const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
   if (!token) {
     return res.status(401).json({ message: 'Unauthorized: No token provided' });
   } 
   //verify token logic here (e.g., using JWT)
   const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string, role: "user" | "seller" };
   if (!decoded) {
     return res.status(401).json({ message: 'Unauthorized: Invalid token' });
   }

   const account = await User.findById(decoded.id).lean();
   req.user = account;
    if (!account) {
        return res.status(401).json({ message: 'Unauthorized: User not found' });
    }
    return next();
} catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Token verification failed' });
     
    
}
}; 

export default isAuthenticated;