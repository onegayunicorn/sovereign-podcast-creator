import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error({ err, path: req.path }, 'Request error');
  const status = (err as any).status || 500;
  res.status(status).json({
    error: err.message || 'Internal server error',
    requestId: (req as any).id,
  });
}
