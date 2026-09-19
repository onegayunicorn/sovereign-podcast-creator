import 'dotenv/config';

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/podcast_creator',
  },
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    serviceAccountPath: process.env.FIREBASE_SERVICE_ACCOUNT_PATH,
  },
  storage: {
    provider: (process.env.STORAGE_PROVIDER || 'local') as 'gcs' | 's3' | 'r2' | 'local',
    bucket: process.env.GCS_BUCKET_NAME || 'sovereign-podcast-assets',
  },
  providers: {
    llm: process.env.LLM_PROVIDER || 'mock',
    tts: process.env.TTS_PROVIDER || 'mock',
    music: process.env.MUSIC_PROVIDER || 'mock',
    image: process.env.IMAGE_PROVIDER || 'mock',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
  },
  quota: {
    dailyLimit: parseInt(process.env.DAILY_GENERATION_LIMIT || '3', 10),
  },
  dsp: {
    workerUrl: process.env.DSP_WORKER_URL || 'http://localhost:5000',
    sampleRate: parseInt(process.env.DSP_SAMPLE_RATE || '22050', 10),
    fftSize: parseInt(process.env.DSP_FFT_SIZE || '2048', 10),
    hopSize: parseInt(process.env.DSP_HOP_SIZE || '512', 10),
  },
} as const;
