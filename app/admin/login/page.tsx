'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock } from 'lucide-react';
import { AwLogo } from '@/components/PublicLayout';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get('from') || '/admin';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Inloggen mislukt');
      }

      router.push(from);
      router.refresh();
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0F3A7A' }}
    >
      <div className="max-w-sm w-full">
        <div className="flex justify-center mb-8">
          <AwLogo inverted />
        </div>
        <div className="bg-white rounded p-8">
          <div className="flex items-center justify-center mb-5">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <Lock className="w-5 h-5" style={{ color: '#0F3A7A' }} />
            </div>
          </div>
          <h1
            className="text-2xl font-black text-center mb-1"
            style={{ color: '#0F3A7A', letterSpacing: '-0.02em' }}
          >
            Matchtool
          </h1>
          <p className="text-sm text-center text-gray-600 mb-6">Log in om beheer te openen</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="aw-input"
              autoFocus
            />
            {error && (
              <div className="p-3 rounded bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || !password}
              className="aw-btn-blue w-full justify-center"
              style={{ padding: '0.85rem' }}
            >
              {loading ? 'Bezig...' : 'Inloggen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
