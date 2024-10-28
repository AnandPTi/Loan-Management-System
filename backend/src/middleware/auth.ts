// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'anandprakash';

export interface AuthRequest extends Request {
  user?: any;
}
export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
  
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded); // Add this log
        
        if (!decoded || typeof decoded !== 'object') {
          return res.status(401).json({ error: 'Invalid token format' });
        }
  
        req.user = decoded;
        console.log('Set user in request:', req.user); // Add this log
        
        return next();
      } catch (jwtError) {
        console.error('JWT verification error:', jwtError);
        return res.status(401).json({ error: 'Invalid token' });
      }
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };


export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.user.role !== 'admin') {
      throw new Error();
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Admin access required' });
  }
};
export const verifierAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      console.log('Entering verifierAuth middleware');
      console.log('User in verifierAuth:', req.user);
      
      if (!req.user) {
        console.log('No user found in request');
        return res.status(403).json({ error: 'No user found in request' });
      }
  
      console.log('User role:', req.user.role);
      
      if (req.user.role !== 'verifier' && req.user.role !== 'admin') {
        console.log('Invalid role detected');
        return res.status(403).json({ error: `Invalid role: ${req.user.role}` });
      }
  
      console.log('Verifier auth passed successfully');
      next();
    } catch (error) {
      console.error('VerifierAuth middleware error:', error);
      return res.status(403).json({ error: 'Verifier access required' });
    }
  };
// export const verifierAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
//     try {
//       console.log('Entering verifierAuth middleware');
//       console.log('User in verifierAuth:', req.user);
      
//       if (!req.user) {
//         return res.status(403).json({ error: 'No user found in request' });
//       }
  
//       if (req.user.role !== 'verifier' && req.user.role !== 'admin') {
//         return res.status(403).json({ error: `Invalid role: ${req.user.role}` });
//       }
  
//       next();
//     } catch (error) {
//       console.error('VerifierAuth middleware error:', error);
//       return res.status(403).json({ error: 'Verifier access required' });
//     }
//   };
// export const verifierAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
//   try {
//     if (req.user.role !== 'verifier' && req.user.role !== 'admin') {
//       throw new Error();
//     }
//     next();
//   } catch (error) {
//     res.status(403).json({ error: 'Verifier access required' });
//   }
// };