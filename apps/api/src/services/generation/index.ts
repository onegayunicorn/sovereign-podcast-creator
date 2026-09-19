import { v4 as uuidv4 } from 'uuid';
import type { GenerationJob, GenerationRequest } from '@sovereign/contracts';
import { orchestrator } from '../orchestrator/index.js';
import { quotaService } from '../quota/index.js';

const jobs = new Map<string, GenerationJob>();

export const generationService = {
  async start(userId: string, request: GenerationRequest): Promise<GenerationJob> {
    const job: GenerationJob = {
      id: uuidv4(),
      userId,
      status: 'QUEUED',
      stage: 'research',
      progress: 0,
      request,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    jobs.set(job.id, job);
    await quotaService.increment(userId);

    orchestrator.run(job).catch((err) => {
      job.status = 'FAILED';
      job.error = err.message;
    });

    return job;
  },

  async get(id: string, userId: string): Promise<GenerationJob | null> {
    const job = jobs.get(id);
    if (!job || job.userId !== userId) return null;
    return job;
  },

  update(id: string, updates: Partial<GenerationJob>) {
    const job = jobs.get(id);
    if (!job) return;
    Object.assign(job, updates, { updatedAt: new Date().toISOString() });
  },
};
