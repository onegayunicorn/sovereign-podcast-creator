import { create } from 'zustand';
import type { Show, GenerationJob, PersonalityProfile, MixerState } from '@sovereign/contracts';

interface BroadcastState {
  currentShow: Show | null;
  activeGeneration: GenerationJob | null;
  library: Show[];
  personality: PersonalityProfile;
  mixer: MixerState;
  isPlaying: boolean;
  currentTime: number;
  volume: number;
  setCurrentShow: (show: Show | null) => void;
  setActiveGeneration: (job: GenerationJob | null) => void;
  addToLibrary: (show: Show) => void;
  setLibrary: (shows: Show[]) => void;
  updatePersonality: (updates: Partial<PersonalityProfile>) => void;
  updateMixer: (updates: Partial<MixerState>) => void;
  setPlaying: (playing: boolean) => void;
  setCurrentTime: (time: number) => void;
  setVolume: (vol: number) => void;
}

const DEFAULT_PERSONALITY: PersonalityProfile = {
  id: 'synth_01',
  name: 'SYNTH-01',
  pitch: { meanHz: 110, varianceHz: 15 },
  tempo: { rate: 0.95 },
  formant: { scale: 1.0 },
  expression: { energy: 0.7, warmth: 0.5, stability: 0.8 },
};

const DEFAULT_MIXER: MixerState = {
  channels: {
    host: { volume: 0.85, muted: false, solo: false },
    guest: { volume: 0.75, muted: false, solo: false },
    music: { volume: 0.15, muted: false, solo: false },
    sfx: { volume: 0.5, muted: false, solo: false },
    caller: { volume: 0.7, muted: false, solo: false },
    aiVoice: { volume: 0.8, muted: false, solo: false },
  },
  master: { volume: 0.9, muted: false, solo: false },
};

export const useBroadcastStore = create<BroadcastState>((set) => ({
  currentShow: null,
  activeGeneration: null,
  library: [],
  personality: DEFAULT_PERSONALITY,
  mixer: DEFAULT_MIXER,
  isPlaying: false,
  currentTime: 0,
  volume: 0.8,
  setCurrentShow: (show) => set({ currentShow: show }),
  setActiveGeneration: (job) => set({ activeGeneration: job }),
  addToLibrary: (show) => set((s) => ({ library: [show, ...s.library] })),
  setLibrary: (shows) => set({ library: shows }),
  updatePersonality: (updates) =>
    set((s) => ({ personality: { ...s.personality, ...updates } })),
  updateMixer: (updates) =>
    set((s) => ({ mixer: { ...s.mixer, ...updates } })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  setCurrentTime: (time) => set({ currentTime: time }),
  setVolume: (vol) => set({ volume: vol }),
}));
