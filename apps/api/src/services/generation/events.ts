import { Response } from 'express';
import type { GenerationEvent } from '@sovereign/contracts';

const clients = new Map<string, Set<Response>>();

export function addSseClient(jobId: string, res: Response) {
  if (!clients.has(jobId)) clients.set(jobId, new Set());
  clients.get(jobId)!.add(res);
}

export function emitEvent(event: GenerationEvent) {
  const set = clients.get(event.jobId);
  if (!set) return;
  const payload = `data: ${JSON.stringify(event)}\n\n`;
  for (const res of set) {
    try {
      res.write(payload);
    } catch {
      set.delete(res);
    }
  }
}

export function closeJob(jobId: string) {
  const set = clients.get(jobId);
  if (!set) return;
  for (const res of set) res.end();
  clients.delete(jobId);
}
