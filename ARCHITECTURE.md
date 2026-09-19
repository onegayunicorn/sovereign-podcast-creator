# Architecture

## Layered System

```
┌─────────────────────────────────────────────────────┐
│  React PWA (apps/web)                               │
│  • Dashboard, Generate, Player, Library             │
│  • Personality Matrix UI                            │
│  • Zustand + Firebase Auth                          │
└──────────────────┬──────────────────────────────────┘
                   │  HTTPS (Bearer ID token)
┌──────────────────▼──────────────────────────────────┐
│  Node API (apps/api)                                │
│  • Express routes: /generate, /shows, /quota        │
│  • Middleware: auth, quota, validation, error       │
│  • Orchestrator (7-stage pipeline)                  │
└────┬──────────────┬───────────────┬─────────────────┘
     │              │               │
     ▼              ▼               ▼
  Research       Script          TTS
   Stage          Stage         Stage
     │              │               │
     └──────┬───────┴───────┬───────┘
            ▼               ▼
       Music Stage     Mix Stage
            │               │
            └──────┬────────┘
                   ▼
         Metadata Stage → Cover Stage
                   │
                   ▼
         Object Storage + PostgreSQL
```

## Provider Adapters

All external AI services are accessed through adapters. The web tier never sees provider credentials.

- `LLMProvider` — Gemini / OpenAI / Mock
- `TTSProvider` — Interactions / OpenAI / ElevenLabs / Mock
- `MusicProvider` — Lyria / Mock
- `ImageProvider` — Gemini / Mock
- `ObjectStorage` — GCS / S3 / R2 / Local

## DSP Engine

`engines/dsp-python/` implements:

- **PhaseVocoder** — STFT, TSM, pitch shift via resampling
- **QuantumCoherenceLayer** — phase drift correction (99.997% target)
- **FormantShifter** — spectral envelope warping (β scaling)
- **Prosody** — `P(t) = μ + σ·sin(2πρt + φ)`

## Pipeline Stages

1. **research** — gather sources
2. **script** — LLM dialogue generation
3. **speech** — TTS per speaker
4. **music** — background bed
5. **mix** — speech 0 dB, music −18 dB
6. **metadata** — title, summary, transcript
7. **cover** — 1:1 artwork
