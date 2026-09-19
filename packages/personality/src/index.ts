import type { PersonalityProfile } from '@sovereign/contracts';

export const PRESET_PROFILES: PersonalityProfile[] = [
  {
    id: 'synth_01',
    name: 'SYNTH-01',
    pitch: { meanHz: 110, varianceHz: 12 },
    tempo: { rate: 0.9 },
    formant: { scale: 1.0 },
    expression: { energy: 0.6, warmth: 0.5, stability: 0.85 },
  },
  {
    id: 'neon_vortex',
    name: 'NEON VORTEX',
    pitch: { meanHz: 145, varianceHz: 22 },
    tempo: { rate: 1.15 },
    formant: { scale: 1.1 },
    expression: { energy: 0.9, warmth: 0.4, stability: 0.6 },
  },
  {
    id: 'oracle_x',
    name: 'ORACLE-X',
    pitch: { meanHz: 95, varianceHz: 8 },
    tempo: { rate: 0.75 },
    formant: { scale: 0.9 },
    expression: { energy: 0.4, warmth: 0.7, stability: 0.95 },
  },
  {
    id: 'skeptical_analyst',
    name: 'SKEPTICAL ANALYST',
    pitch: { meanHz: 130, varianceHz: 10 },
    tempo: { rate: 0.85 },
    formant: { scale: 0.95 },
    expression: { energy: 0.55, warmth: 0.45, stability: 0.9 },
  },
  {
    id: 'enthusiastic_visionary',
    name: 'ENTHUSIASTIC',
    pitch: { meanHz: 150, varianceHz: 25 },
    tempo: { rate: 1.2 },
    formant: { scale: 1.05 },
    expression: { energy: 0.95, warmth: 0.6, stability: 0.5 },
  },
];

/**
 * P(t) = μ + σ·sin(2πρt + φ)
 * Pitch contour over time
 */
export function pitchContour(
  profile: PersonalityProfile,
  t: number,
  phase = 0
): number {
  const { meanHz, varianceHz } = profile.pitch;
  const { rate } = profile.tempo;
  return meanHz + varianceHz * Math.sin(2 * Math.PI * rate * t + phase);
}

/**
 * H_new(ω) = H_old(ω/β)
 * Formant envelope scaling
 */
export function formantScale(profile: PersonalityProfile, freq: number): number {
  return freq / profile.formant.scale;
}
