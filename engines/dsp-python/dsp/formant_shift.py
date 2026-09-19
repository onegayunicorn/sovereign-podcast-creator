"""Formant scaling via STFT magnitude warping."""
from __future__ import annotations
import numpy as np
from numpy.typing import NDArray


class FormantShifter:
    def __init__(self, beta: float = 1.0):
        """β > 1 → smaller vocal tract (feminine/child). β < 1 → larger (masculine)."""
        self.beta = beta

    def apply(
        self, signal: NDArray[np.float64], sr: int, fft_size: int = 2048, hop: int = 512
    ) -> NDArray[np.float64]:
        window = np.hanning(fft_size)
        frames = []
        for i in range(0, len(signal) - fft_size + 1, hop):
            frames.append(window * signal[i : i + fft_size])
        frames = np.array(frames)

        stft = np.fft.rfft(frames, axis=1)
        mag = np.abs(stft)
        phase = np.angle(stft)

        n_bins = mag.shape[1]
        src_bins = np.arange(n_bins) / self.beta
        warped = np.zeros_like(mag)
        for i in range(mag.shape[0]):
            warped[i] = np.interp(
                np.arange(n_bins), src_bins, mag[i], left=0, right=0
            )

        out_stft = warped * np.exp(1j * phase)
        out_frames = np.fft.irfft(out_stft, n=fft_size, axis=1)

        out_len = (len(out_frames) - 1) * hop + fft_size
        out = np.zeros(out_len)
        wsum = np.zeros(out_len)
        for i, f in enumerate(out_frames):
            t = i * hop
            out[t : t + fft_size] += window * f
            wsum[t : t + fft_size] += window ** 2

        nonzero = wsum > 1e-8
        out[nonzero] /= wsum[nonzero]
        return out
