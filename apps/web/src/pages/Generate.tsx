import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic2, Sparkles, Music, Clock } from 'lucide-react';
import { PersonalityMatrix } from '../components/personality/PersonalityMatrix';
import { useBroadcastStore } from '../store/broadcastStore';
import { apiFetch } from '../lib/api';

const CATEGORIES = [
  { id: 'tech', label: 'Tech', icon: Sparkles },
  { id: 'culture', label: 'Culture', icon: Music },
  { id: 'news', label: 'News', icon: Clock },
];

export function Generate() {
  const navigate = useNavigate();
  const { personality } = useBroadcastStore();
  const [prompt, setPrompt] = useState('');
  const [category, setCategory] = useState('tech');
  const [duration, setDuration] = useState(5);
  const [mood, setMood] = useState('informative');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const job = await apiFetch<{ id: string }>('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt,
          category,
          targetDuration: duration,
          mood,
          personality: {
            host: personality.id,
            guest: 'enthusiastic_visionary',
          },
        }),
      });

      navigate(`/generating/${job.id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Show</h1>
        <p className="text-muted">Describe your episode and let Antigravity build it</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="panel">
            <label className="label">Episode Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want this episode to be about..."
              className="input min-h-[200px] resize-none font-mono text-sm"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted">{prompt.length} / 10000</span>
            </div>
          </div>

          <div className="panel">
            <label className="label">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setCategory(id)}
                  className={`p-3 rounded-lg border flex items-center gap-2 transition-all ${
                    category === id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-surface hover:border-primary/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="panel">
              <label className="label">Duration</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={30}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="slider flex-1"
                />
                <span className="text-sm font-mono text-primary w-12">{duration} min</span>
              </div>
            </div>

            <div className="panel">
              <label className="label">Mood</label>
              <select value={mood} onChange={(e) => setMood(e.target.value)} className="input">
                <option value="informative">Informative</option>
                <option value="energetic">Energetic</option>
                <option value="calm">Calm</option>
                <option value="dramatic">Dramatic</option>
                <option value="humorous">Humorous</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="panel border-danger/50 bg-danger/10 text-danger text-sm">{error}</div>
          )}

          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || loading}
            className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                Starting Generation...
              </>
            ) : (
              <>
                <Mic2 className="w-5 h-5" />
                Generate Show
              </>
            )}
          </button>
        </div>

        <div className="col-span-1">
          <PersonalityMatrix />
        </div>
      </div>
    </div>
  );
}
