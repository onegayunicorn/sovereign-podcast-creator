import { useAuthStore } from '../../store/authStore';
import { LogIn, LogOut } from 'lucide-react';

export function TopBar() {
  const { user, signIn, signOut } = useAuthStore();

  return (
    <header className="h-16 border-b border-border bg-surface/50 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-danger/10 border border-danger/30 rounded-full">
          <div className="w-2 h-2 rounded-full bg-danger animate-pulse" />
          <span className="text-xs font-semibold text-danger">ON AIR</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-medium">{user.displayName || 'User'}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-panel transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4 text-muted" />
            </button>
          </div>
        ) : (
          <button onClick={signIn} className="btn-primary flex items-center gap-2">
            <LogIn className="w-4 h-4" />
            Sign in
          </button>
        )}
      </div>
    </header>
  );
}
