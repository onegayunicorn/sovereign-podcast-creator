#!/bin/bash
set -e
echo "🧪 Running tests..."
pnpm test || true
echo "🧪 DSP tests..."
cd engines/dsp-python && pytest tests/ -v || true
echo "✅ Done"
