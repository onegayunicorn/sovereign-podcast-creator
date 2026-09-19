import numpy as np
import pytest
from dsp.phase_vocoder import PhaseVocoder


SR = 22050


def _sine(freq=440.0, duration=0.5):
    t = np.arange(int(SR * duration)) / SR
    return np.sin(2 * np.pi * freq * t).astype(np.float64)


def test_time_stretch_length():
    pv = PhaseVocoder()
    x = _sine()
    y = pv.time_stretch(x, 1.5)
    ratio = len(y) / len(x)
    assert 1.3 < ratio < 1.7, f"Unexpected ratio {ratio}"


def test_pitch_preservation_under_tsm():
    pv = PhaseVocoder()
    x = _sine(440.0)
    y = pv.time_stretch(x, 1.5)
    spec = np.abs(np.fft.rfft(y))
    peak = np.argmax(spec) * SR / len(y)
    assert abs(peak - 440) < 15, f"Pitch drifted to {peak} Hz"


def test_pitch_shift_semitone():
    pv = PhaseVocoder()
    x = _sine(440.0)
    y = pv.pitch_shift(x, 12)  # one octave up
    spec = np.abs(np.fft.rfft(y))
    peak = np.argmax(spec) * SR / len(y)
    assert abs(peak - 880) < 30, f"Expected 880 Hz, got {peak} Hz"
