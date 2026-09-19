import { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { logger } from '../lib/logger.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    name?: string;
  };
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    // Dev mode fallback when Firebase is not configured
    if (process.env.NODE_ENV === 'development' || process.env.ENABLE_MOCK_PROVIDERS === 'true') {
      req.user = { uid: 'dev-user', email: 'dev@sovereign.local', name: 'Dev User' };
      return next();
    }
    return res.status(401).json({ error: 'Unauthorized — no token provided' });
  }

  const token = header.split('Bearer ')[1];

  try {
    const decoded = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch (err) {
    logger.warn({ err }, 'Token verification failed');
    return res.status(401).json({ error: 'Unauthorized — invalid token' });
  }
}
