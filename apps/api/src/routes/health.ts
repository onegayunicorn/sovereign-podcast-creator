import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'sovereign-podcast-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});
