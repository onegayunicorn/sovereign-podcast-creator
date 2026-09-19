import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import { config } from './config.js';
import { logger } from './lib/logger.js';
import { requestId } from './middleware/requestId.js';
import { errorHandler } from './middleware/error.js';
import { authRouter } from './routes/auth.js';
import { generationRouter } from './routes/generation.js';
import { showsRouter } from './routes/shows.js';
import { quotaRouter } from './routes/quota.js';
import { healthRouter } from './routes/health.js';
import { initFirebaseAdmin } from './lib/firebase-admin.js';

const app = express();

initFirebaseAdmin();

app.use(helmet());
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(requestId);
app.use(pinoHttp({ logger }));

app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/generate', generationRouter);
app.use('/api/generations', generationRouter);
app.use('/api/shows', showsRouter);
app.use('/api/quota', quotaRouter);

app.use(errorHandler);

app.listen(config.port, () => {
  logger.info(`🚀 API listening on :${config.port}`);
  logger.info(`   Environment: ${config.nodeEnv}`);
  logger.info(`   Providers: LLM=${config.providers.llm} TTS=${config.providers.tts} Music=${config.providers.music}`);
});
