import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { enforceQuota } from '../middleware/quota.js';
import { generationService } from '../services/generation/index.js';
import { addSseClient } from '../services/generation/events.js';

export const generationRouter = Router();

const GenerateSchema = z.object({
  prompt: z.string().min(10).max(10000),
  category: z.enum(['tech', 'culture', 'news']),
  targetDuration: z.number().min(1).max(60),
  mood: z.string().max(100),
  personality: z.object({
    host: z.string(),
    guest: z.string(),
  }),
});

generationRouter.post(
  '/',
  requireAuth,
  enforceQuota,
  async (req: AuthenticatedRequest, res) => {
    const parsed = GenerateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request', details: parsed.error });
    }

    const job = await generationService.start(req.user!.uid, parsed.data);
    res.status(202).json({ id: job.id, status: job.status });
  }
);

generationRouter.get(
  '/:id',
  requireAuth,
  async (req: AuthenticatedRequest, res) => {
    const job = await generationService.get(req.params.id, req.user!.uid);
    if (!job) return res.status(404).json({ error: 'Not found' });
    res.json(job);
  }
);

generationRouter.get('/:id/events', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  addSseClient(req.params.id, res);

  req.on('close', () => {
    // cleanup handled in events service
  });
});
