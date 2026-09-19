import { Router } from 'express';
import { requireAuth, type AuthenticatedRequest } from '../middleware/auth.js';
import { showsService } from '../services/shows/index.js';

export const showsRouter = Router();

showsRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const shows = await showsService.list(req.user!.uid);
  res.json(shows);
});

showsRouter.get('/shared/:shareId', async (req, res) => {
  const show = await showsService.getByShareId(req.params.shareId);
  if (!show) return res.status(404).json({ error: 'Not found' });
  res.json(show);
});

showsRouter.get('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const show = await showsService.get(req.params.id, req.user!.uid);
  if (!show) return res.status(404).json({ error: 'Not found' });
  res.json(show);
});

showsRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  await showsService.delete(req.params.id, req.user!.uid);
  res.status(204).end();
});

showsRouter.post('/:id/share', requireAuth, async (req: AuthenticatedRequest, res) => {
  const shareId = await showsService.createShare(req.params.id, req.user!.uid);
  res.json({ shareId });
});
