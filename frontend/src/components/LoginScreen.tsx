import { useState } from 'react';
import type { FormEvent } from 'react';

interface Props {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

export function LoginScreen({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const ok = await onLogin(username, password);
      if (!ok) {
        setError('ユーザー名またはパスワードが正しくありません');
      }
    } catch {
      setError('サーバーに接続できません');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
            YearCal
          </h1>
          <p className="text-slate-400 mt-2 text-sm">年間カレンダー</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4"
        >
          <div>
            <label className="block text-sm text-slate-400 mb-1">ユーザー名</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed text-slate-900 font-semibold rounded-lg py-2 text-sm transition-colors"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>
      </div>
    </div>
  );
}
