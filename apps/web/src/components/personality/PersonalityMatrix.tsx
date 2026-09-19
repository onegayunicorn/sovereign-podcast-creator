import { useBroadcastStore } from '../../store/broadcastStore';
import type { PersonalityProfile } from '@sovereign/contracts';
import { PRESET_PROFILES } from '@sovereign/personality';
import { Brain, Zap, Radio as RadioIcon } from 'lucide-react';

export function PersonalityMatrix() {
  const { personality, updatePersonality } = useBroadcastStore();

  const handlePreset = (preset: PersonalityProfile) => {
    updatePersonality(preset);
  };

  return (
    <div className="panel">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-4 h-4 text-secondary" />
        <h3 className="text-sm font-semibold tracking-wide">HOST PERSONALITY MATRIX</h3>
      </div>

      <div className="grid grid-cols-1 gap-2 mb-6">
        {PRESET_PROFILES.slice(0, 3).map((preset) => (
          <button
            key={preset.id}
            onClick={() => handlePreset(preset)}
            className={`p-3 rounded-lg border text-left transition-all ${
              personality.id === preset.id
                ? 'border-secondary bg-secondary/10'
                : 'border-border bg-surface hover:border-secondary/50'
            }`}
          >
            <div className="text-xs font-bold mb-1">{preset.name}</div>
            <div className="text-[10px] text-muted">
              {preset.pitch.meanHz}Hz · {preset.tempo.rate.toFixed(2)}x
            </div>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <SliderControl
          label="Pitch"
          value={personality.pitch.meanHz}
          min={60}
          max={220}
          unit="Hz"
          icon={<RadioIcon className="w-3 h-3" />}
          onChange={(v) =>
            updatePersonality({ pitch: { ...personality.pitch, meanHz: v } })
          }
        />
        <SliderControl
          label="Cadence"
          value={personality.tempo.rate * 100}
          min={50}
          max={150}
          unit="%"
          icon={<Zap className="w-3 h-3" />}
          onChange={(v) =>
            updatePersonality({ tempo: { ...personality.tempo, rate: v / 100 } })
          }
        />
        <SliderControl
          label="Energy"
          value={personality.expression.energy * 100}
          min={0}
          max={100}
          unit="%"
          onChange={(v) =>
            updatePersonality({
              expression: { ...personality.expression, energy: v / 100 },
            })
          }
        />
      </div>
    </div>
  );
}

function SliderControl({
  label,
  value,
  min,
  max,
  unit,
  icon,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  icon?: React.ReactNode;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-muted flex items-center gap-1.5">
          {icon}
          {label}
        </span>
        <span className="text-xs font-mono text-primary">
          {Math.round(value)}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  );
}
