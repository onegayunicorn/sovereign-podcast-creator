import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '../lib/api';
import type { Show } from '@sovereign/contracts';

export function Player() {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<Show | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    apiFetch<Show>(`/api/shows/${id}`)
      .then(setShow)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!show) {
    return <div className="text-center text-muted py-20">Show not found (mock stage — real audio pending providers)</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="panel">
        <h1 className="text-2xl font-bold mb-2">{show.title}</h1>
        <p className="text-muted mb-4">{show.summary}</p>
        <div className="text-xs text-muted font-mono space-y-1">
          <div>Duration: {Math.floor(show.duration / 60)}m {show.duration % 60}s</div>
          <div>Created: {new Date(show.createdAt).toLocaleDateString()}</div>
          <div>Audio: {show.audioUrl}</div>
        </div>
      </div>

      <div className="panel">
        <h3 className="text-sm font-semibold mb-4 tracking-wide">TRANSCRIPT</h3>
        <div className="space-y-3">
          {(show.transcript || []).map((seg, i) => (
            <div key={i} className="flex gap-3">
              <span className="text-xs text-muted font-mono w-12 shrink-0 pt-1">
                {Math.floor(seg.startTime / 60)}:{(seg.startTime % 60).toString().padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="text-xs font-semibold text-primary mb-1">{seg.speaker}</div>
                <p className="text-sm text-text/90">{seg.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
