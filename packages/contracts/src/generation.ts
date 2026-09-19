export type GenerationStage =
  | 'research'
  | 'script'
  | 'speech'
  | 'music'
  | 'mix'
  | 'metadata'
  | 'cover';

export type GenerationStatus =
  | 'QUEUED'
  | 'RESEARCHING'
  | 'SCRIPTING'
  | 'SYNTHESIZING'
  | 'MUSIC_GENERATING'
  | 'MIXING'
  | 'METADATA'
  | 'COVER'
  | 'UPLOADING'
  | 'COMPLETE'
  | 'FAILED';

export interface GenerationRequest {
  prompt: string;
  category: 'tech' | 'culture' | 'news';
  targetDuration: number;
  mood: string;
  personality: {
    host: string;
    guest: string;
  };
}

export interface GenerationJob {
  id: string;
  userId: string;
  status: GenerationStatus;
  stage: GenerationStage;
  progress: number;
  request: GenerationRequest;
  result?: {
    showId: string;
    audioUrl: string;
    coverUrl: string;
  };
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerationEvent {
  jobId: string;
  stage?: GenerationStage;
  status?: GenerationStatus;
  type: 'info' | 'thinking' | 'tool_call' | 'tool_result' | 'text' | 'error';
  message: string;
  progress?: number;
  timestamp: string;
}
