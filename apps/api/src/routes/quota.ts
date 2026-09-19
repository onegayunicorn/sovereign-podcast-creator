import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { quotaService } from '../services/quota/index.js';

export const quotaRouter = Router();

quotaRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const status = await quotaService.check(req.user!.uid);
  res.json(status);
});
