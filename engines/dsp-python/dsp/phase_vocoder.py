"""
Phase Vocoder — production implementation.

Mathematical foundation:
    STFT: X(k,m) = Σ x[n + m·Ha]·w[n]·e^(-j·2π/N·kn)
    TSM:  α = Hs / Ha
    Inst. freq: ω̂(k,m) = 2πk/N + princarg(Δφ_dev)/Ha
    Synth phase: φ_syn(k,m) = φ_syn(k,m-1) + Hs·ω̂(k,m)
    ISTFT: overlap-add with normalization
"""
from __future__ import annotations

import numpy as np
from numpy.typing import NDArray


class PhaseVocoder:
    def __init__(self, fft_size: int = 2048, hop_a: int = 512, sample_rate: int = 22050):
        self.N = fft_size
        self.hop_a = hop_a
        self.sample_rate = sample_rate
        self.window = np.hanning(fft_size).astype(np.float64)
        self._validate_cola()

    def _validate_cola(self):
        if self.hop_a > self.N // 2:
            raise ValueError("hop_a must be ≤ N/2 for COLA-compliant Hann window")

    def stft(self, signal: NDArray[np.float64]) -> NDArray[np.complex128]:
        if len(signal) < self.N:
            signal = np.pad(signal, (0, self.N - len(signal)))
        frames = []
        for i in range(0, len(signal) - self.N + 1, self.hop_a):
            frame = self.window * signal[i : i + self.N]
            frames.append(np.fft.rfft(frame))
        return np.array(frames)

    def istft(self, frames: NDArray[np.complex128], hop_s: int) -> NDArray[np.float64]:
        N = self.N
        out_len = (len(frames) - 1) * hop_s + N
        out = np.zeros(out_len, dtype=np.float64)
        win_sum = np.zeros(out_len, dtype=np.float64)

        for idx, frame in enumerate(frames):
            t = idx * hop_s
            y = np.fft.irfft(frame, n=N)
            out[t : t + N] += self.window * y
            win_sum[t : t + N] += self.window ** 2

        nonzero = win_sum > 1e-8
        out[nonzero] /= win_sum[nonzero]
        return out

    def time_stretch(
        self, signal: NDArray[np.float64], alpha: float
    ) -> NDArray[np.float64]:
        if alpha <= 0:
            raise ValueError("alpha must be > 0")

        hop_s = int(round(self.hop_a * alpha))
        frames = self.stft(signal)
        mags = np.abs(frames)
        phases = np.angle(frames)

        syn_phase = phases[0].copy()
        out_frames = np.zeros_like(frames, dtype=np.complex128)
        out_frames[0] = mags[0] * np.exp(1j * syn_phase)

        k = np.arange(frames.shape[1])
        expected_delta = 2 * np.pi * k * self.hop_a / self.N
        omega_base = 2 * np.pi * k / self.N

        for m in range(1, len(frames)):
            delta_phi = phases[m] - phases[m - 1]
            dev = delta_phi - expected_delta
            wrapped = (dev + np.pi) % (2 * np.pi) - np.pi
            inst_freq = omega_base + wrapped / self.hop_a
            syn_phase = syn_phase + hop_s * inst_freq
            out_frames[m] = mags[m] * np.exp(1j * syn_phase)

        return self.istft(out_frames, hop_s)

    def pitch_shift(
        self, signal: NDArray[np.float64], semitones: float
    ) -> NDArray[np.float64]:
        s_p = 2.0 ** (semitones / 12.0)
        stretched = self.time_stretch(signal, s_p)
        target_len = len(signal)
        src_idx = np.arange(target_len) * s_p
        src_idx = src_idx[src_idx < len(stretched) - 1]
        shifted = np.interp(
            src_idx, np.arange(len(stretched)), stretched
        )
        return shifted
