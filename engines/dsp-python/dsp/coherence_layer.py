"""
Quantum Coherence Layer — phase drift correction.

Target coherence: 0.99997
"""
from __future__ import annotations
import numpy as np
from numpy.typing import NDArray


class QuantumCoherenceLayer:
    def __init__(self, target: float = 0.99997):
        self.target = target
        self.ref_phase: NDArray[np.float64] | None = None

    def stabilize(
        self, frame_phase: NDArray[np.float64], timestep: int
    ) -> tuple[NDArray[np.float64], float]:
        if self.ref_phase is None:
            self.ref_phase = frame_phase.copy()
            return frame_phase, 1.0

        ideal = self.ref_phase + 2 * np.pi * timestep / 100
        drift = float(np.mean(np.abs(frame_phase - ideal)))
        coherence = float(np.clip(1.0 - drift / np.pi, 0.0, 1.0))

        if coherence < self.target:
            corrected = frame_phase + (ideal - frame_phase) * 0.5
            return corrected, coherence
        return frame_phase, coherence
