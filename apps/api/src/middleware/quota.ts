import { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from './auth.js';
import { quotaService } from '../services/quota/index.js';

export async function enforceQuota(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

  const status = await quotaService.check(req.user.uid);
  if (!status.allowed) {
    return res.status(429).json({
      error: 'Daily quota exceeded',
      quota: status,
    });
  }

  next();
}
