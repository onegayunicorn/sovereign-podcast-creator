"""
Prosody model based on the Personality Matrix.

P(t) = μ + σ·sin(2πρt + φ)
H_new(ω) = H_old(ω/β)
"""
from __future__ import annotations
import numpy as np
from dataclasses import dataclass


@dataclass
class PersonalityProfile:
    name: str
    mu: float        # mean pitch Hz
    sigma: float     # variance Hz
    rho: float       # tempo/rate
    beta: float      # formant scale

    def pitch_contour(self, t: np.ndarray, phase: float = 0.0) -> np.ndarray:
        return self.mu + self.sigma * np.sin(2 * np.pi * self.rho * t + phase)


PRESETS = {
    "synth_01":               PersonalityProfile("SYNTH-01", 110, 12, 0.90, 1.00),
    "neon_vortex":            PersonalityProfile("NEON VORTEX", 145, 22, 1.15, 1.10),
    "oracle_x":               PersonalityProfile("ORACLE-X", 95, 8, 0.75, 0.90),
    "skeptical_analyst":      PersonalityProfile("SKEPTICAL ANALYST", 130, 10, 0.85, 0.95),
    "enthusiastic_visionary": PersonalityProfile("ENTHUSIASTIC VISIONARY", 150, 25, 1.20, 1.05),
}
