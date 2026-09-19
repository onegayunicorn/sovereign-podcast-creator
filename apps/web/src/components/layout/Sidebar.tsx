import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Mic2,
  Library as LibraryIcon,
  Settings as SettingsIcon,
  Radio,
} from 'lucide-react';

const nav = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/generate', icon: Mic2, label: 'New Show' },
  { to: '/library', icon: LibraryIcon, label: 'Episodes' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-surface/50 flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Radio className="w-6 h-6 text-background" />
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">SOVEREIGN</h1>
            <p className="text-xs text-muted">Podcast Creator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted hover:text-text hover:bg-surface'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted text-center">v1.0.0 · Sovereign</div>
      </div>
    </aside>
  );
}
