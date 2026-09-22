import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const token = authorization.slice(7);

  if (!token) {
    return res.status(401).json({
      error: 'Authentication required',
    });
  }

  const secret = process.env.JWT_SECRET;

  if (!secret) {
    return res.status(500).json({
      error: 'JWT_SECRET is not configured',
    });
  }

  try {
    const decoded = jwt.verify(token, secret);

    if (typeof decoded !== 'object' || decoded === null || typeof decoded.userId !== 'string') {
      return res.status(401).json({
        error: 'Invalid token',
      });
    }

    req.userId = decoded.userId;

    next();
  } catch {
    return res.status(401).json({
      error: 'Invalid or expired token',
    });
  }
}
