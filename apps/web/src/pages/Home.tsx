import { Link } from 'react-router-dom';
import { Plus, Radio, Clock, TrendingUp, Mic2 } from 'lucide-react';
import { useBroadcastStore } from '../store/broadcastStore';

export function Home() {
  const { library } = useBroadcastStore();

  const stats = [
    { label: 'Episodes', value: library.length, icon: Radio },
    { label: 'Listening Time', value: '0h 0m', icon: Clock },
    { label: 'This Week', value: '+0', icon: TrendingUp },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted">Welcome to Sovereign Podcast Creator</p>
        </div>
        <Link to="/generate" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Show
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="panel">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Episodes</h2>
        {library.length === 0 ? (
          <div className="panel text-center py-12">
            <Mic2 className="w-12 h-12 text-muted mx-auto mb-4" />
            <p className="text-muted mb-4">No episodes yet</p>
            <Link to="/generate" className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create your first show
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {library.slice(0, 6).map((show) => (
              <Link
                key={show.id}
                to={`/player/${show.id}`}
                className="panel hover:border-primary/50 transition-colors"
              >
                <h3 className="font-medium truncate">{show.title}</h3>
                <p className="text-xs text-muted truncate">{show.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
