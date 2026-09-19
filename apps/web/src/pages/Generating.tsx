import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Loader2, Circle, AlertCircle, Terminal } from 'lucide-react';

const STAGES = [
  { id: 'research', label: 'Research', desc: 'Gathering source material' },
  { id: 'script', label: 'Script Writing', desc: 'Generating dialogue' },
  { id: 'speech', label: 'Speech Synthesis', desc: 'Converting to audio' },
  { id: 'music', label: 'Music Generation', desc: 'Creating background' },
  { id: 'mix', label: 'Audio Mixing', desc: 'Combining tracks' },
  { id: 'metadata', label: 'Metadata', desc: 'Extracting show details' },
  { id: 'cover', label: 'Cover Image', desc: 'Generating artwork' },
];

export function Generating() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(0);
  const [logs, setLogs] = useState<Array<{ type: string; message: string; ts: number }>>([]);
  const [status, setStatus] = useState<'running' | 'complete' | 'failed'>('running');
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const evtSource = new EventSource(`${API_URL}/api/generations/${id}/events`);

    evtSource.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setLogs((prev) => [...prev, { ...data, ts: Date.now() }]);

      if (data.stage) {
        const idx = STAGES.findIndex((s) => s.id === data.stage);
        if (idx >= 0) setCurrentStage(idx);
      }

      if (data.status === 'COMPLETE') {
        setStatus('complete');
        evtSource.close();
        setTimeout(() => navigate(`/player/${id}`), 1500);
      } else if (data.status === 'FAILED') {
        setStatus('failed');
        evtSource.close();
      }
    };

    evtSource.onerror = () => {
      evtSource.close();
    };

    return () => evtSource.close();
  }, [id, navigate]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generating Episode</h1>
        <p className="text-muted font-mono text-sm">Job ID: {id}</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="panel">
          <h3 className="text-sm font-semibold mb-4 tracking-wide">PIPELINE</h3>
          <div className="space-y-3">
            {STAGES.map((stage, idx) => {
              const done = idx < currentStage;
              const active = idx === currentStage;
              return (
                <div key={stage.id} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {done ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : active ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <Circle className="w-5 h-5 text-border" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`text-sm font-medium ${
                        active ? 'text-primary' : done ? 'text-text' : 'text-muted'
                      }`}
                    >
                      {stage.label}
                    </div>
                    <div className="text-xs text-muted">{stage.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="panel">
          <div className="flex items-center gap-2 mb-4">
            <Terminal className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-wide">AGENT LOG</h3>
          </div>
          <div className="bg-background/50 rounded-lg p-3 h-[400px] overflow-y-auto font-mono text-xs space-y-1">
            {logs.length === 0 && <div className="text-muted">Waiting for agent...</div>}
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-muted">{new Date(log.ts).toLocaleTimeString()}</span>
                <span className={log.type === 'error' ? 'text-danger' : 'text-text'}>
                  {log.message}
                </span>
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>

      {status === 'complete' && (
        <div className="panel border-success/50 bg-success/10 text-success mt-6 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5" />
          <span>Generation complete! Redirecting to player...</span>
        </div>
      )}

      {status === 'failed' && (
        <div className="panel border-danger/50 bg-danger/10 text-danger mt-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span>Generation failed. Please try again.</span>
        </div>
      )}
    </div>
  );
}
