export interface TranscriptSegment {
  speaker: string;
  text: string;
  startTime: number;
  endTime: number;
}

export interface Show {
  id: string;
  userId: string;
  title: string;
  summary: string;
  duration: number;
  audioUrl: string;
  coverUrl: string;
  transcript: TranscriptSegment[];
  prompt: string;
  category: string;
  mood: string;
  personality: {
    host: string;
    guest: string;
  };
  shareId?: string;
  createdAt: string;
}
