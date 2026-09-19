import numpy as np
from dsp.coherence_layer import QuantumCoherenceLayer


def test_coherence_initialization():
    qcl = QuantumCoherenceLayer()
    phase = np.ones(1024)
    _, c = qcl.stabilize(phase, 0)
    assert c == 1.0


def test_coherence_above_target():
    qcl = QuantumCoherenceLayer()
    scores = []
    for t in range(20):
        phase = np.ones(1024) + 0.001 * t
        _, c = qcl.stabilize(phase, t)
        scores.append(c)
    avg = np.mean(scores)
    assert avg > 0.9, f"Average coherence {avg} too low"
