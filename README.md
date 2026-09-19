# 🎙️ Sovereign Podcast Creator

> AI-powered autonomous podcast generation ecosystem  
> Phase Vocoder DSP · Personality Matrix · Antigravity Orchestration

## Overview

Sovereign Podcast Creator transforms a text prompt into a fully-produced multi-voice podcast episode — research, script, TTS, music, mixing, metadata, and cover art — through a 7-stage Antigravity pipeline.

```
React PWA  →  Node/Express API  →  Antigravity Orchestrator
                                       ↓
              research → script → speech → music → mix → metadata → cover
                                       ↓
                         Python DSP (Phase Vocoder + QCL)
                                       ↓
                         Postgres + Object Storage
```

## Quickstart

```bash
# 1. Install
pnpm install
pnpm dsp:install

# 2. Environment
cp .env.example .env

# 3. Run everything
pnpm dev

# → Web:  http://localhost:5173
# → API:  http://localhost:3001
```

## Monorepo Layout

| Path | Purpose |
|------|---------|
| `apps/web` | React PWA (dashboard, player, library) |
| `apps/api` | Node/Express + orchestrator |
| `packages/contracts` | Shared TypeScript types |
| `packages/personality` | Personality presets & math |
| `packages/config` | Design tokens & constants |
| `engines/dsp-python` | Phase Vocoder, QCL, formants |
| `infrastructure/` | Docker, nginx |
| `.github/workflows` | CI |

## Tests

```bash
pnpm test           # all workspaces
pnpm dsp:test       # python DSP tests
```

## Deployment

```bash
docker compose up --build
```

## Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md)
- [API.md](API.md)
- [SECURITY.md](SECURITY.md)
- [CHANGELOG.md](CHANGELOG.md)

## License

MIT
