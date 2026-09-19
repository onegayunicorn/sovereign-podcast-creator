import type { GenerationJob } from '@sovereign/contracts';
import { emitEvent, closeJob } from '../generation/events.js';
import { researchStage } from './stages/research.js';
import { scriptStage } from './stages/script.js';
import { speechStage } from './stages/speech.js';
import { musicStage } from './stages/music.js';
import { mixStage } from './stages/mix.js';
import { metadataStage } from './stages/metadata.js';
import { coverStage } from './stages/cover.js';
import { generationService } from '../generation/index.js';
import { showsService } from '../shows/index.js';
import { logger } from '../../lib/logger.js';

interface PipelineContext {
  job: GenerationJob;
  research?: any;
  script?: any;
  speech?: any;
  music?: any;
  mix?: any;
  metadata?: any;
  cover?: any;
}

const STAGES = [
  { name: 'research', fn: researchStage, status: 'RESEARCHING' as const },
  { name: 'script', fn: scriptStage, status: 'SCRIPTING' as const },
  { name: 'speech', fn: speechStage, status: 'SYNTHESIZING' as const },
  { name: 'music', fn: musicStage, status: 'MUSIC_GENERATING' as const },
  { name: 'mix', fn: mixStage, status: 'MIXING' as const },
  { name: 'metadata', fn: metadataStage, status: 'METADATA' as const },
  { name: 'cover', fn: coverStage, status: 'COVER' as const },
];

export const orchestrator = {
  async run(job: GenerationJob) {
    const ctx: PipelineContext = { job };

    try {
      for (let i = 0; i < STAGES.length; i++) {
        const stage = STAGES[i];
        const progress = Math.round(((i + 1) / STAGES.length) * 100);

        generationService.update(job.id, {
          stage: stage.name as any,
          status: stage.status,
          progress,
        });

        emitEvent({
          jobId: job.id,
          stage: stage.name as any,
          status: stage.status,
          type: 'info',
          message: `Stage: ${stage.name}`,
          progress,
          timestamp: new Date().toISOString(),
        });

        // Simulate processing time
        await new Promise((r) => setTimeout(r, 400));

        (ctx as any)[stage.name] = await stage.fn(ctx);
      }

      const show = await showsService.create({
        userId: job.userId,
        title: ctx.metadata.title,
        summary: ctx.metadata.summary,
        duration: ctx.metadata.duration,
        audioUrl: ctx.mix.audioUrl,
        coverUrl: ctx.cover.imageUrl,
        transcript: ctx.metadata.transcript,
        prompt: job.request.prompt,
        category: job.request.category,
        mood: job.request.mood,
        personality: job.request.personality,
      });

      generationService.update(job.id, {
        status: 'COMPLETE',
        progress: 100,
        result: {
          showId: show.id,
          audioUrl: show.audioUrl,
          coverUrl: show.coverUrl,
        },
      });

      emitEvent({
        jobId: job.id,
        status: 'COMPLETE',
        type: 'text',
        message: 'Generation complete',
        progress: 100,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      logger.error({ err, jobId: job.id }, 'Pipeline failed');
      generationService.update(job.id, { status: 'FAILED', error: err.message });
      emitEvent({
        jobId: job.id,
        status: 'FAILED',
        type: 'error',
        message: err.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      closeJob(job.id);
    }
  },
};
