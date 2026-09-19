export function Settings() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      <div className="space-y-6">
        <section className="panel">
          <h2 className="text-lg font-semibold mb-4">Account</h2>
          <p className="text-sm text-muted">Firebase authentication is configured (mock in dev).</p>
        </section>
        <section className="panel">
          <h2 className="text-lg font-semibold mb-4">Quota</h2>
          <p className="text-sm text-muted">3 shows per day (configurable via DAILY_GENERATION_LIMIT)</p>
        </section>
        <section className="panel">
          <h2 className="text-lg font-semibold mb-4">DSP Engine</h2>
          <p className="text-sm text-muted">Phase Vocoder · Quantum Coherence Layer · 99.997% target</p>
        </section>
      </div>
    </div>
  );
}
