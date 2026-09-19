export const theme = {
  colors: {
    background: '#05050A',
    surface: '#0B0B14',
    panel: '#10101C',
    border: '#27273A',
    primary: '#00E5FF',
    secondary: '#A855F7',
    accent: '#FF2BD6',
    success: '#22C55E',
    warning: '#F59E0B',
    danger: '#EF4444',
    text: '#F8FAFC',
    muted: '#94A3B8',
  },
  mix: {
    speechDb: 0,
    musicDb: -18,
    musicFadeInSeconds: 3,
    musicFadeOutSeconds: 5,
    masterFadeInSeconds: 0.5,
    masterFadeOutSeconds: 2,
    speechEndPaddingSeconds: 3,
  },
  dsp: {
    sampleRate: 22050,
    fftSize: 2048,
    hopSize: 512,
    overlap: 4,
    schumannResonance: 7.83,
    coherenceTarget: 0.99997,
  },
} as const;

export type Theme = typeof theme;
