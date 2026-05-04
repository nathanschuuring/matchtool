'use client';

import { useState } from 'react';
import { Building2, Mail, CheckCircle, AlertCircle } from 'lucide-react';

export default function SettingsForm({
  initialSettings,
}: {
  initialSettings: Record<string, string>;
}) {
  const [form, setForm] = useState({
    notification_email: initialSettings.notification_email || '',
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Opslaan mislukt');
      showToast('success', 'Instellingen opgeslagen');
    } catch (e: any) {
      showToast('error', e.message || 'Er ging iets mis');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-black aw-admin-title">Instellingen</h1>
        <p className="mt-1 text-gray-600">Configuratie van je ActiveWork</p>
      </div>

      <div className="space-y-6">
        {/* Notificaties */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-5">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <Mail className="w-5 h-5" style={{ color: '#0F3A7A' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#0F3A7A' }}>
                Notificaties
              </h3>
              <p className="text-sm text-gray-600">
                E-mailadres dat een melding krijgt bij elke nieuwe sollicitatie
              </p>
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-bold mb-1.5 block text-gray-800">
              E-mailadres voor sollicitatie-meldingen
            </span>
            <input
              type="email"
              value={form.notification_email}
              onChange={(e) => setForm({ ...form, notification_email: e.target.value })}
              placeholder="bijv. nathan@activework.tech"
              className="aw-input"
            />
            <p className="text-xs mt-2 text-gray-500">
              Tip: meerdere adressen kun je scheiden met komma's, bijv.{' '}
              <code className="text-xs bg-gray-100 px-1 rounded">a@b.nl, c@d.nl</code>
            </p>
          </label>
        </div>

        {/* Domein info (read-only) */}
        <div className="bg-white rounded border border-gray-200 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: '#EFF4FB' }}
            >
              <Building2 className="w-5 h-5" style={{ color: '#0F3A7A' }} />
            </div>
            <div>
              <h3 className="font-black" style={{ color: '#0F3A7A' }}>
                Domein
              </h3>
              <p className="text-sm text-gray-600">
                Het domein staat ingesteld in Vercel als environment variable
              </p>
            </div>
          </div>
          <code className="text-sm bg-gray-50 border border-gray-200 px-3 py-2 rounded block">
            {process.env.NEXT_PUBLIC_SITE_URL || '(niet ingesteld)'}
          </code>
        </div>

        {/* Save knop */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="aw-btn-blue"
          >
            <CheckCircle className="w-4 h-4" /> {saving ? 'Bezig...' : 'Opslaan'}
          </button>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-xl flex items-center gap-2 z-50"
          style={{
            background: toast.type === 'success' ? '#0F3A7A' : '#DC2626',
            color: 'white',
          }}
        >
          {toast.type === 'success' ? (
            <CheckCircle className="w-4 h-4" style={{ color: '#FFE81A' }} />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}
    </div>
  );
}
