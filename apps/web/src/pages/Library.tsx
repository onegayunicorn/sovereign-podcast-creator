import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { useBroadcastStore } from '../store/broadcastStore';
import { apiFetch } from '../lib/api';
import type { Show } from '@sovereign/contracts';

export function Library() {
  const { library, setLibrary } = useBroadcastStore();

  useEffect(() => {
    apiFetch<Show[]>('/api/shows').then(setLibrary).catch(console.error);
  }, [setLibrary]);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Library</h1>
        <p className="text-muted">{library.length} episodes</p>
      </div>

      {library.length === 0 ? (
        <div className="panel text-center py-20">
          <p className="text-muted mb-4">Your library is empty</p>
          <Link to="/generate" className="btn-primary inline-block">
            Generate First Show
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {library.map((show) => (
            <Link key={show.id} to={`/player/${show.id}`} className="panel hover:border-primary/50 transition-colors">
              <h3 className="font-medium text-sm mb-1 truncate">{show.title}</h3>
              <p className="text-xs text-muted mb-3 truncate">{show.summary}</p>
              <div className="flex items-center text-xs text-muted">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(show.createdAt).toLocaleDateString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
